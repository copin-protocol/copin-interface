import dayjs from 'dayjs'

import { TraderGroupAction, TraderGroupState } from './types'

/**
 * Reducer for trader group state management
 */
export function traderGroupReducer(state: TraderGroupState, action: TraderGroupAction): TraderGroupState {
  switch (action.type) {
    case 'SET_NAME': {
      return {
        ...state,
        name: action.payload,
      }
    }

    case 'SET_DESCRIPTION': {
      return {
        ...state,
        description: action.payload,
      }
    }

    case 'ADD_TRADER': {
      const { account, protocol } = action.payload
      const newTrader = {
        address: account,
        protocol,
        enableAlert: true,
        createdAt: dayjs().utc().toISOString(),
      }
      return {
        ...state,
        traderGroupAdd: [newTrader, ...(state.traderGroupAdd ?? [])],
      }
    }

    case 'UPDATE_TRADER': {
      const { address, protocol } = action.payload

      // Check if trader is in traderGroupAdd
      if (state.traderGroupAdd?.some((e) => e.address === address && e.protocol === protocol)) {
        return {
          ...state,
          traderGroupAdd: state.traderGroupAdd.map((trader) =>
            trader.address === address && trader.protocol === protocol
              ? { ...trader, enableAlert: !trader.enableAlert }
              : trader
          ),
        }
      }

      // Check if trader is already in traderGroupUpdate
      if (state.traderGroupUpdate?.some((e) => e.address === address && e.protocol === protocol)) {
        return {
          ...state,
          traderGroupUpdate: state.traderGroupUpdate.map((trader) =>
            trader.address === address && trader.protocol === protocol
              ? { ...trader, enableAlert: !trader.enableAlert }
              : trader
          ),
        }
      }

      // Add to traderGroupUpdate
      return {
        ...state,
        traderGroupUpdate: [
          { address, protocol, enableAlert: !action.payload.enableAlert },
          ...(state.traderGroupUpdate ?? []),
        ],
      }
    }

    case 'REMOVE_TRADER': {
      const { address, protocol } = action.payload

      // If trader was added in this session, just remove from traderGroupAdd
      if (state.traderGroupAdd?.some((e) => e.address === address && e.protocol === protocol)) {
        return {
          ...state,
          traderGroupAdd: state.traderGroupAdd.filter((e) => e.address !== address || e.protocol !== protocol),
        }
      }

      // Otherwise, add to traderGroupRemove
      return {
        ...state,
        traderGroupRemove: [{ address, protocol }, ...(state.traderGroupRemove ?? [])],
      }
    }

    case 'RESET':
      return {
        name: action?.payload?.name,
        description: action?.payload?.description,
        traderGroupAdd: action.payload?.traderGroupAdd,
        traderGroupUpdate: action.payload?.traderGroupUpdate,
        traderGroupRemove: action.payload?.traderGroupRemove,
      }

    default:
      return state
  }
}
