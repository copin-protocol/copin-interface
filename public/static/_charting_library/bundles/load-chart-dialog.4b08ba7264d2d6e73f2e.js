(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5009],
  {
    46188: (e) => {
      e.exports = {
        container: "container-AhaeiE0y",
        list: "list-AhaeiE0y",
        overlayScrollWrap: "overlayScrollWrap-AhaeiE0y",
        scroll: "scroll-AhaeiE0y",
      };
    },
    12961: (e) => {
      e.exports = { container: "container-huGG8x61", title: "title-huGG8x61" };
    },
    40281: (e) => {
      e.exports = {
        container: "container-qm7Rg5MB",
        inputContainer: "inputContainer-qm7Rg5MB",
        withCancel: "withCancel-qm7Rg5MB",
        input: "input-qm7Rg5MB",
        icon: "icon-qm7Rg5MB",
        cancel: "cancel-qm7Rg5MB",
      };
    },
    64409: (e) => {
      e.exports = {
        container: "container-RZoAcQrm",
        labelWrap: "labelWrap-RZoAcQrm",
        icon: "icon-RZoAcQrm",
        text: "text-RZoAcQrm",
      };
    },
    33476: (e) => {
      e.exports = { sortButton: "sortButton-mMR_mxxG", icon: "icon-mMR_mxxG" };
    },
    45300: (e) => {
      e.exports = {};
    },
    75623: (e) => {
      e.exports = { highlighted: "highlighted-cwp8YRo6" };
    },
    71986: (e) => {
      e.exports = {
        "tablet-small-breakpoint": "screen and (max-width: 430px)",
        item: "item-jFqVJoPk",
        hovered: "hovered-jFqVJoPk",
        isDisabled: "isDisabled-jFqVJoPk",
        isActive: "isActive-jFqVJoPk",
        shortcut: "shortcut-jFqVJoPk",
        toolbox: "toolbox-jFqVJoPk",
        withIcon: "withIcon-jFqVJoPk",
        "round-icon": "round-icon-jFqVJoPk",
        icon: "icon-jFqVJoPk",
        labelRow: "labelRow-jFqVJoPk",
        label: "label-jFqVJoPk",
        showOnHover: "showOnHover-jFqVJoPk",
        "disclosure-item-circle-logo": "disclosure-item-circle-logo-jFqVJoPk",
        showOnFocus: "showOnFocus-jFqVJoPk",
      };
    },
    27267: (e, t, a) => {
      "use strict";
      function n(e, t, a, n, o) {
        function r(o) {
          if (e > o.timeStamp) return;
          const r = o.target;
          void 0 !== a &&
            null !== t &&
            null !== r &&
            r.ownerDocument === n &&
            (t.contains(r) || a(o));
        }
        return (
          o.click && n.addEventListener("click", r, !1),
          o.mouseDown && n.addEventListener("mousedown", r, !1),
          o.touchEnd && n.addEventListener("touchend", r, !1),
          o.touchStart && n.addEventListener("touchstart", r, !1),
          () => {
            n.removeEventListener("click", r, !1),
              n.removeEventListener("mousedown", r, !1),
              n.removeEventListener("touchend", r, !1),
              n.removeEventListener("touchstart", r, !1);
          }
        );
      }
      a.d(t, { addOutsideEventListener: () => n });
    },
    90186: (e, t, a) => {
      "use strict";
      function n(e) {
        return r(e, i);
      }
      function o(e) {
        return r(e, l);
      }
      function r(e, t) {
        const a = Object.entries(e).filter(t),
          n = {};
        for (const [e, t] of a) n[e] = t;
        return n;
      }
      function i(e) {
        const [t, a] = e;
        return 0 === t.indexOf("data-") && "string" == typeof a;
      }
      function l(e) {
        return 0 === e[0].indexOf("aria-");
      }
      a.d(t, {
        filterAriaProps: () => o,
        filterDataProps: () => n,
        filterProps: () => r,
        isAriaAttribute: () => l,
        isDataAttribute: () => i,
      });
    },
    69654: (e, t, a) => {
      "use strict";
      a.d(t, { DialogSearch: () => u });
      var n = a(50959),
        o = a(97754),
        r = a.n(o),
        i = a(44352),
        l = a(9745),
        s = a(69859),
        c = a(40281);
      function u(e) {
        const {
          children: t,
          renderInput: o,
          onCancel: u,
          containerClassName: d,
          inputContainerClassName: h,
          iconClassName: g,
          ...y
        } = e;
        return n.createElement(
          "div",
          { className: r()(c.container, d) },
          n.createElement(
            "div",
            { className: r()(c.inputContainer, h, u && c.withCancel) },
            o || n.createElement(m, { ...y }),
          ),
          t,
          n.createElement(l.Icon, { className: r()(c.icon, g), icon: s }),
          u &&
            n.createElement(
              "div",
              { className: c.cancel, onClick: u },
              i.t(null, void 0, a(20036)),
            ),
        );
      }
      function m(e) {
        const {
          className: t,
          reference: a,
          value: o,
          onChange: i,
          onFocus: l,
          onBlur: s,
          onKeyDown: u,
          onSelect: m,
          placeholder: d,
          ...h
        } = e;
        return n.createElement("input", {
          ...h,
          ref: a,
          type: "text",
          className: r()(t, c.input),
          autoComplete: "off",
          "data-role": "search",
          placeholder: d,
          value: o,
          onChange: i,
          onFocus: l,
          onBlur: s,
          onSelect: m,
          onKeyDown: u,
        });
      }
    },
    76068: (e, t, a) => {
      "use strict";
      a.d(t, { CircleLogo: () => r });
      var n = a(50959),
        o = a(58492);
      a(45300);
      function r(e) {
        var t, a;
        const r = (0, o.getStyleClasses)(e.size, e.className),
          i =
            null !== (a = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== a
              ? a
              : "";
        return (0, o.isCircleLogoWithUrlProps)(e)
          ? n.createElement("img", {
              className: r,
              src: e.logoUrl,
              alt: i,
              title: e.title,
              loading: e.loading,
              "aria-label": e["aria-label"],
              "aria-hidden": e["aria-hidden"],
            })
          : n.createElement(
              "span",
              {
                className: r,
                title: e.title,
                "aria-label": e["aria-label"],
                "aria-hidden": e["aria-hidden"],
              },
              e.placeholderLetter,
            );
      }
    },
    58492: (e, t, a) => {
      "use strict";
      a.d(t, { getStyleClasses: () => o, isCircleLogoWithUrlProps: () => r });
      var n = a(97754);
      function o(e, t) {
        return n("tv-circle-logo", `tv-circle-logo--${e}`, t);
      }
      function r(e) {
        return "logoUrl" in e && void 0 !== e.logoUrl && 0 !== e.logoUrl.length;
      }
    },
    19785: (e, t, a) => {
      "use strict";
      a.d(t, {
        createRegExpList: () => r,
        getHighlightedChars: () => i,
        rankedSearch: () => o,
      });
      var n = a(1722);
      function o(e) {
        const {
          data: t,
          rules: a,
          queryString: o,
          isPreventedFromFiltering: r,
          primaryKey: i,
          secondaryKey: l = i,
          optionalPrimaryKey: s,
          tertiaryKey: c,
        } = e;
        return t
          .map((e) => {
            const t = s && e[s] ? e[s] : e[i],
              r = e[l],
              u = c && e[c];
            let m,
              d = 0;
            return (
              a.forEach((e) => {
                var a, i, l, s, c;
                const { re: h, fullMatch: g } = e;
                if (
                  ((h.lastIndex = 0),
                  (0, n.isString)(t) &&
                    t &&
                    t.toLowerCase() === o.toLowerCase())
                )
                  return (
                    (d = 4),
                    void (m =
                      null === (a = t.match(g)) || void 0 === a
                        ? void 0
                        : a.index)
                  );
                if ((0, n.isString)(t) && g.test(t))
                  return (
                    (d = 3),
                    void (m =
                      null === (i = t.match(g)) || void 0 === i
                        ? void 0
                        : i.index)
                  );
                if ((0, n.isString)(r) && g.test(r))
                  return (
                    (d = 2),
                    void (m =
                      null === (l = r.match(g)) || void 0 === l
                        ? void 0
                        : l.index)
                  );
                if ((0, n.isString)(r) && h.test(r))
                  return (
                    (d = 2),
                    void (m =
                      null === (s = r.match(h)) || void 0 === s
                        ? void 0
                        : s.index)
                  );
                if (Array.isArray(u))
                  for (const e of u)
                    if (g.test(e))
                      return (
                        (d = 1),
                        void (m =
                          null === (c = e.match(g)) || void 0 === c
                            ? void 0
                            : c.index)
                      );
              }),
              { matchPriority: d, matchIndex: m, item: e }
            );
          })
          .filter((e) => r || e.matchPriority)
          .sort((e, t) => {
            if (e.matchPriority < t.matchPriority) return 1;
            if (e.matchPriority > t.matchPriority) return -1;
            if (e.matchPriority === t.matchPriority) {
              if (void 0 === e.matchIndex || void 0 === t.matchIndex) return 0;
              if (e.matchIndex > t.matchIndex) return 1;
              if (e.matchIndex < t.matchIndex) return -1;
            }
            return 0;
          })
          .map(({ item: e }) => e);
      }
      function r(e, t) {
        const a = [],
          n = e.toLowerCase(),
          o =
            e
              .split("")
              .map((e, t) => `(${0 !== t ? `[/\\s-]${l(e)}` : l(e)})`)
              .join("(.*?)") + "(.*)";
        return (
          a.push({
            fullMatch: new RegExp(`(${l(e)})`, "i"),
            re: new RegExp(`^${o}`, "i"),
            reserveRe: new RegExp(o, "i"),
            fuzzyHighlight: !0,
          }),
          t &&
            t.hasOwnProperty(n) &&
            a.push({ fullMatch: t[n], re: t[n], fuzzyHighlight: !1 }),
          a
        );
      }
      function i(e, t, a) {
        const n = [];
        return e && a
          ? (a.forEach((e) => {
              const { fullMatch: a, re: o, reserveRe: r } = e;
              (a.lastIndex = 0), (o.lastIndex = 0);
              const i = a.exec(t),
                l = i || o.exec(t) || (r && r.exec(t));
              if (((e.fuzzyHighlight = !i), l))
                if (e.fuzzyHighlight) {
                  let e = l.index;
                  for (let t = 1; t < l.length; t++) {
                    const a = l[t],
                      o = l[t].length;
                    if (t % 2) {
                      const t =
                        a.startsWith(" ") ||
                        a.startsWith("/") ||
                        a.startsWith("-");
                      n[t ? e + 1 : e] = !0;
                    }
                    e += o;
                  }
                } else
                  for (let e = 0; e < l[0].length; e++) n[l.index + e] = !0;
            }),
            n)
          : n;
      }
      function l(e) {
        return e.replace(/[!-/[-^{-}?]/g, "\\$&");
      }
    },
    24637: (e, t, a) => {
      "use strict";
      a.d(t, { HighlightedText: () => l });
      var n = a(50959),
        o = a(97754),
        r = a(19785),
        i = a(75623);
      function l(e) {
        const { queryString: t, rules: a, text: l, className: s } = e,
          c = (0, n.useMemo)(
            () => (0, r.getHighlightedChars)(t, l, a),
            [t, a, l],
          );
        return n.createElement(
          n.Fragment,
          null,
          c.length
            ? l
                .split("")
                .map((e, t) =>
                  n.createElement(
                    n.Fragment,
                    { key: t },
                    c[t]
                      ? n.createElement(
                          "span",
                          { className: o(i.highlighted, s) },
                          e,
                        )
                      : n.createElement("span", null, e),
                  ),
                )
            : l,
        );
      }
    },
    16396: (e, t, a) => {
      "use strict";
      a.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => u,
        PopupMenuItem: () => d,
      });
      var n = a(50959),
        o = a(97754),
        r = a(59064),
        i = a(51768),
        l = a(90186),
        s = a(76068),
        c = a(71986);
      const u = c;
      function m(e) {
        e.stopPropagation();
      }
      function d(e) {
        const {
            id: t,
            role: a,
            "aria-label": u,
            "aria-selected": d,
            "aria-checked": h,
            className: g,
            title: y,
            labelRowClassName: f,
            labelClassName: p,
            shortcut: v,
            forceShowShortcuts: _,
            icon: b,
            isActive: C,
            isDisabled: w,
            isHovered: k,
            appearAsDisabled: L,
            label: D,
            link: E,
            showToolboxOnHover: S,
            showToolboxOnFocus: x,
            target: A,
            rel: N,
            toolbox: M,
            reference: z,
            onMouseOut: T,
            onMouseOver: F,
            onKeyDown: I,
            suppressToolboxClick: Z = !0,
            theme: R = c,
            tabIndex: P,
            tagName: j,
            renderComponent: B,
            roundedIcon: O,
            iconAriaProps: W,
            circleLogo: q,
          } = e,
          H = (0, l.filterDataProps)(e),
          U = (0, n.useRef)(null),
          V = (0, n.useMemo)(
            () =>
              (function (e) {
                function t(t) {
                  const { reference: a, ...o } = t,
                    r = null != e ? e : o.href ? "a" : "div",
                    i =
                      "a" === r
                        ? o
                        : (function (e) {
                            const {
                              download: t,
                              href: a,
                              hrefLang: n,
                              media: o,
                              ping: r,
                              rel: i,
                              target: l,
                              type: s,
                              referrerPolicy: c,
                              ...u
                            } = e;
                            return u;
                          })(o);
                  return n.createElement(r, { ...i, ref: a });
                }
                return (t.displayName = `DefaultComponent(${e})`), t;
              })(j),
            [j],
          ),
          Y = null != B ? B : V;
        return n.createElement(
          Y,
          {
            ...H,
            id: t,
            role: a,
            "aria-label": u,
            "aria-selected": d,
            "aria-checked": h,
            className: o(g, R.item, b && R.withIcon, {
              [R.isActive]: C,
              [R.isDisabled]: w || L,
              [R.hovered]: k,
            }),
            title: y,
            href: E,
            target: A,
            rel: N,
            reference: function (e) {
              (U.current = e), "function" == typeof z && z(e);
              "object" == typeof z && (z.current = e);
            },
            onClick: function (t) {
              const {
                dontClosePopup: a,
                onClick: n,
                onClickArg: o,
                trackEventObject: l,
              } = e;
              if (w) return;
              l && (0, i.trackEvent)(l.category, l.event, l.label);
              n && n(o, t);
              a || (0, r.globalCloseMenu)();
            },
            onContextMenu: function (t) {
              const { trackEventObject: a, trackRightClick: n } = e;
              a &&
                n &&
                (0, i.trackEvent)(a.category, a.event, `${a.label}_rightClick`);
            },
            onMouseUp: function (t) {
              const { trackEventObject: a, trackMouseWheelClick: n } = e;
              if (1 === t.button && E && a) {
                let e = a.label;
                n && (e += "_mouseWheelClick"),
                  (0, i.trackEvent)(a.category, a.event, e);
              }
            },
            onMouseOver: F,
            onMouseOut: T,
            onKeyDown: I,
            tabIndex: P,
          },
          q &&
            n.createElement(s.CircleLogo, {
              ...W,
              className: c["disclosure-item-circle-logo"],
              size: "xxxsmall",
              logoUrl: q.logoUrl,
              placeholderLetter: q.placeholderLetter,
            }),
          b &&
            n.createElement("span", {
              "aria-label": W && W["aria-label"],
              "aria-hidden": W && Boolean(W["aria-hidden"]),
              className: o(R.icon, O && c["round-icon"]),
              dangerouslySetInnerHTML: { __html: b },
            }),
          n.createElement(
            "span",
            { className: o(R.labelRow, f) },
            n.createElement("span", { className: o(R.label, p) }, D),
          ),
          (void 0 !== v || _) &&
            n.createElement(
              "span",
              { className: R.shortcut },
              (J = v) && J.split("+").join(" + "),
            ),
          void 0 !== M &&
            n.createElement(
              "span",
              {
                onClick: Z ? m : void 0,
                className: o(R.toolbox, {
                  [R.showOnHover]: S,
                  [R.showOnFocus]: x,
                }),
              },
              M,
            ),
        );
        var J;
      }
    },
    20520: (e, t, a) => {
      "use strict";
      a.d(t, { PopupMenu: () => d });
      var n = a(50959),
        o = a(962),
        r = a(62942),
        i = a(65718),
        l = a(27317),
        s = a(29197);
      const c = n.createContext(void 0);
      var u = a(36383);
      const m = n.createContext({ setMenuMaxWidth: !1 });
      function d(e) {
        const {
            controller: t,
            children: a,
            isOpened: d,
            closeOnClickOutside: h = !0,
            doNotCloseOn: g,
            onClickOutside: y,
            onClose: f,
            onKeyboardClose: p,
            "data-name": v = "popup-menu-container",
            ..._
          } = e,
          b = (0, n.useContext)(s.CloseDelegateContext),
          C = n.useContext(m),
          w = (0, n.useContext)(c),
          k = (0, u.useOutsideEvent)({
            handler: function (e) {
              y && y(e);
              if (!h) return;
              const t = (0, r.default)(g) ? g() : null == g ? [] : [g];
              if (t.length > 0 && e.target instanceof Node)
                for (const a of t) {
                  const t = o.findDOMNode(a);
                  if (t instanceof Node && t.contains(e.target)) return;
                }
              f();
            },
            mouseDown: !0,
            touchStart: !0,
          });
        return d
          ? n.createElement(
              i.Portal,
              {
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                pointerEvents: "none",
              },
              n.createElement(
                "span",
                { ref: k, style: { pointerEvents: "auto" } },
                n.createElement(
                  l.Menu,
                  {
                    ..._,
                    onClose: f,
                    onKeyboardClose: p,
                    onScroll: function (t) {
                      const { onScroll: a } = e;
                      a && a(t);
                    },
                    customCloseDelegate: b,
                    customRemeasureDelegate: w,
                    ref: t,
                    "data-name": v,
                    limitMaxWidth: C.setMenuMaxWidth,
                  },
                  a,
                ),
              ),
            )
          : null;
      }
    },
    29276: (e) => {
      e.exports = {
        highlight: "highlight-6tu1aYjZ",
        active: "active-6tu1aYjZ",
      };
    },
    47541: (e) => {
      e.exports = {
        dialog: "dialog-T4Q8BJPb",
        contentList: "contentList-T4Q8BJPb",
        contentHeader: "contentHeader-T4Q8BJPb",
      };
    },
    12811: (e, t, a) => {
      "use strict";
      a.d(t, {
        HorizontalAttachEdge: () => o,
        HorizontalDropDirection: () => i,
        VerticalAttachEdge: () => n,
        VerticalDropDirection: () => r,
        getPopupPositioner: () => c,
      });
      var n,
        o,
        r,
        i,
        l = a(50151);
      !(function (e) {
        (e[(e.Top = 0)] = "Top"),
          (e[(e.Bottom = 1)] = "Bottom"),
          (e[(e.AutoStrict = 2)] = "AutoStrict");
      })(n || (n = {})),
        (function (e) {
          (e[(e.Left = 0)] = "Left"), (e[(e.Right = 1)] = "Right");
        })(o || (o = {})),
        (function (e) {
          (e[(e.FromTopToBottom = 0)] = "FromTopToBottom"),
            (e[(e.FromBottomToTop = 1)] = "FromBottomToTop");
        })(r || (r = {})),
        (function (e) {
          (e[(e.FromLeftToRight = 0)] = "FromLeftToRight"),
            (e[(e.FromRightToLeft = 1)] = "FromRightToLeft");
        })(i || (i = {}));
      const s = {
        verticalAttachEdge: n.Bottom,
        horizontalAttachEdge: o.Left,
        verticalDropDirection: r.FromTopToBottom,
        horizontalDropDirection: i.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1,
      };
      function c(e, t) {
        return (a, c, u, m) => {
          var d, h;
          const g = (0, l.ensureNotNull)(e).getBoundingClientRect(),
            {
              horizontalAttachEdge: y = s.horizontalAttachEdge,
              horizontalDropDirection: f = s.horizontalDropDirection,
              horizontalMargin: p = s.horizontalMargin,
              verticalMargin: v = s.verticalMargin,
              matchButtonAndListboxWidths: _ = s.matchButtonAndListboxWidths,
            } = t;
          let b =
              null !== (d = t.verticalAttachEdge) && void 0 !== d
                ? d
                : s.verticalAttachEdge,
            C =
              null !== (h = t.verticalDropDirection) && void 0 !== h
                ? h
                : s.verticalDropDirection;
          b === n.AutoStrict &&
            (m < g.y + g.height + v + c
              ? ((b = n.Top), (C = r.FromBottomToTop))
              : ((b = n.Bottom), (C = r.FromTopToBottom)));
          const w = b === n.Top ? -1 * v : v,
            k = y === o.Right ? g.right : g.left,
            L = b === n.Top ? g.top : g.bottom,
            D = {
              x: k - (f === i.FromRightToLeft ? a : 0) + p,
              y: L - (C === r.FromBottomToTop ? c : 0) + w,
            };
          return _ && (D.overrideWidth = g.width), D;
        };
      }
    },
    34557: (e, t, a) => {
      "use strict";
      a.r(t), a.d(t, { LoadChartDialogRenderer: () => re });
      var n = a(50959),
        o = a(962),
        r = a(97754),
        i = a.n(r),
        l = a(50151),
        s = a(44352),
        c = a(56840),
        u = a(49483),
        m = a(35057),
        d = a(20520),
        h = a(12811),
        g = a(9745),
        y = a(44563),
        f = a(645),
        p = a(33476);
      function v(e) {
        const { sortDirection: t, children: a, ...o } = e,
          i = (0, n.useRef)(null),
          [l, s] = (0, n.useState)(!1);
        return n.createElement(
          "div",
          {
            ...o,
            ref: i,
            className: r(
              p.sortButton,
              "apply-common-tooltip",
              "common-tooltip-vertical",
            ),
            onClick: function () {
              s(!l);
            },
          },
          n.createElement(g.Icon, { className: p.icon, icon: 0 === t ? y : f }),
          n.createElement(
            d.PopupMenu,
            {
              doNotCloseOn: i.current,
              isOpened: l,
              onClose: () => {
                s(!1);
              },
              position: (0, h.getPopupPositioner)(i.current, {
                verticalMargin: -35,
                verticalAttachEdge: 0,
              }),
            },
            a,
          ),
        );
      }
      var _ = a(16396),
        b = a(64409);
      function C(e) {
        const {
            label: t,
            listSortField: a,
            itemSortField: o,
            listSortDirection: i,
            itemSortDirection: l,
            onClick: s,
            className: c,
            ...u
          } = e,
          m = o === a && l === i;
        return n.createElement(_.PopupMenuItem, {
          ...u,
          className: r(b.container, c),
          label: n.createElement(
            "div",
            { className: b.labelWrap },
            n.createElement(g.Icon, {
              className: b.icon,
              icon: 0 === l ? y : f,
            }),
            n.createElement("span", { className: b.text }, t),
          ),
          isActive: m,
          onClick: function () {
            s(o, l);
          },
          "data-active": m.toString(),
          "data-sort-field": o,
          "data-sort-direction": 0 === l ? "asc" : "desc",
        });
      }
      var w = a(69654),
        k = a(12961);
      function L(e) {
        const { children: t, className: a } = e;
        return n.createElement("div", { className: i()(k.container, a) }, t);
      }
      function D(e) {
        const { title: t } = e;
        return n.createElement("div", { className: k.title }, t);
      }
      var E = a(50335);
      var S = a(20037),
        x = a(38223),
        A = a(898),
        N = a(33127);
      var M = a(3085),
        z = a(46188);
      function T(e) {
        const {
            className: t,
            onScroll: a,
            onTouchStart: o,
            reference: r,
            children: l,
            scrollbar: s,
            ...c
          } = e,
          [m, d] = (0, A.useDimensions)(),
          [h, g, y, f] = (0, N.useOverlayScroll)();
        return (
          (0, n.useEffect)(() => {
            const e = () => {};
            return u.isFF
              ? (document.addEventListener("wheel", () => e),
                () => {
                  document.removeEventListener("wheel", e);
                })
              : e;
          }, []),
          n.createElement(
            "div",
            {
              ...("overlay" === s && g),
              className: i()(z.container, t),
              onTouchStart: o,
              onScrollCapture: a,
              ref: m,
            },
            "overlay" === s &&
              n.createElement(M.OverlayScrollContainer, {
                ...h,
                className: z.overlayScrollWrap,
              }),
            n.createElement(S.FixedSizeList, {
              ref: r,
              className: i()("native" === s ? z.scroll : z.list),
              outerRef: "overlay" === s ? y : void 0,
              onItemsRendered: f,
              layout: "vertical",
              width: "100%",
              height: (null == d ? void 0 : d.height) || 0,
              children: l,
              direction: (0, x.isRtl)() ? "rtl" : "ltr",
              ...c,
            }),
          )
        );
      }
      var F = a(84015);
      var I = a(14483),
        Z = a(64530),
        R = a(94025),
        P = a(60508),
        j = a(3615);
      var B = a(53741),
        O = a(79206),
        W = a(24637),
        q = a(19785),
        H = a(29276);
      const U = new B.DateFormatter("dd-MM-yyyy"),
        V = new O.TimeFormatter(O.hourMinuteFormat),
        Y = I.enabled("items_favoriting");
      function J(e) {
        const {
            chart: t,
            chartWidgetCollection: o,
            trackEvent: r,
            localFavorites: l,
            setLocalFavorites: c,
            onClose: u,
            searchString: m,
            onClickRemove: d,
            onRemoveCanceled: h,
            isSelected: g,
          } = e,
          [y, f] = (0, n.useState)(() => t.active()),
          [p, v] = (0, n.useState)(!1),
          _ = t.url
            ? (function (e) {
                const t = e.chartId ? `/chart/${e.chartId}/` : "/chart/",
                  a = new URL(t, location.href);
                return (
                  e.symbol && a.searchParams.append("symbol", e.symbol),
                  e.interval && a.searchParams.append("interval", e.interval),
                  e.style && a.searchParams.append("style", e.style),
                  (0, F.urlWithMobileAppParams)(a.href)
                );
              })({ chartId: t.url })
            : void 0,
          b = (0, n.useContext)(P.SlotContext),
          C = (0, n.useMemo)(() => new Date(1e3 * t.modified), [t]),
          w = (0, n.useMemo)(() => (0, q.createRegExpList)(m), [m]),
          k = i()(H.highlight, y && H.active);
        return (
          (0, n.useEffect)(
            () => (
              o && o.metaInfo.id.subscribe(D),
              () => {
                o && o.metaInfo.id.unsubscribe(D);
              }
            ),
            [],
          ),
          n.createElement(Z.DialogContentItem, {
            url: _,
            title: n.createElement(W.HighlightedText, {
              className: k,
              queryString: m,
              rules: w,
              text: t.title,
            }),
            subtitle: n.createElement(
              n.Fragment,
              null,
              n.createElement(W.HighlightedText, {
                className: k,
                queryString: m,
                rules: w,
                text: t.description,
              }),
              " ",
              "(",
              U.format(C).replace(/-/g, "."),
              " ",
              V.formatLocal(C),
              ")",
            ),
            onClick: function (e) {
              0;
              t.openAction(), !1;
            },
            onClickFavorite: function () {
              0;
              const e = { ...l };
              e[t.id] ? delete e[t.id] : (e[t.id] = !0);
              t.favoriteAction(e).then(() => {
                0;
              });
            },
            showFavorite: Y,
            onClickRemove: async function () {
              if (p) return;
              v(!0);
              const e = await (async function (e) {
                return s.t(null, { replace: { name: e.title } }, a(69368));
              })(t);
              v(!1),
                (function (e, t, a, n) {
                  (0, j.showConfirm)(
                    {
                      text: e,
                      onConfirm: ({ dialogClose: e }) => {
                        t(), e();
                      },
                      onClose: () => {
                        a();
                      },
                    },
                    n,
                  );
                })(e, L, h, b);
            },
            isFavorite: Boolean(l[t.id]),
            isActive: y,
            isSelected: g,
            "data-name": "load-chart-dialog-item",
          })
        );
        function L() {
          t.deleteAction().then(() => d(t.id));
        }
        function D(e) {
          f(t.id === e);
        }
      }
      var K = a(59064),
        $ = a(68335);
      var G = a(47541);
      const Q = { sortField: "modified", sortDirection: 1 },
        X = (function (e) {
          const { paddingTop: t = 0, paddingBottom: a = 0 } = e;
          return (0, n.forwardRef)(({ style: e, ...o }, r) => {
            const { height: i = 0 } = e;
            return n.createElement("div", {
              ref: r,
              style: {
                ...e,
                height: `${((0, E.isNumber)(i) ? i : parseFloat(i)) + t + a}px`,
              },
              ...o,
            });
          });
        })({ paddingBottom: 6 });
      function ee(e) {
        let t;
        try {
          t = (0, R.getTranslatedResolution)(e);
        } catch (a) {
          t = e;
        }
        return t;
      }
      const te = I.enabled("items_favoriting"),
        ae = s.t(null, void 0, a(75789));
      function ne(e) {
        const {
            charts: t,
            onClose: o,
            favoriteChartsService: r,
            chartWidgetCollection: d,
          } = e,
          [h, g] = (0, n.useState)(""),
          [y, f] = (0, n.useState)(h),
          [p, _] = (0, n.useState)([]),
          b = (0, n.useRef)(null),
          [k, E] = (0, n.useState)(function () {
            if (r) return r.get();
            const e = {};
            return (
              t
                .filter((e) => e.favorite)
                .forEach((t) => {
                  e[t.id] = !0;
                }),
              e
            );
          }),
          [S, x] = (0, n.useState)(() =>
            c.getJSON("loadChartDialog.viewState", Q),
          ),
          A = (0, n.useRef)(null),
          N = (0, n.useRef)(null),
          M = (0, n.useMemo)(
            () =>
              t.map((e) => ({
                ...e,
                description: `${e.symbol}, ${ee(e.interval)}`,
              })),
            [t],
          );
        (0, n.useEffect)(() => {
          u.CheckMobile.any() || (0, l.ensureNotNull)(A.current).focus();
        }, []);
        const z = (0, n.useRef)();
        (0, n.useEffect)(
          () => (
            (z.current = setTimeout(() => {
              g(y);
            }, 300)),
            () => {
              clearTimeout(z.current);
            }
          ),
          [y],
        ),
          (0, n.useEffect)(
            () => (
              null == r || r.getOnChange().subscribe(null, H),
              () => {
                null == r || r.getOnChange().unsubscribe(null, H);
              }
            ),
            [],
          );
        const F = (0, n.useCallback)(() => !0, []),
          I = (0, n.useMemo)(() => {
            return (0, q.rankedSearch)({
              data: M.filter((e) => !p.includes(e.id)).sort(
                ((e = S.sortDirection),
                (t, a) => {
                  if (k[t.id] && !k[a.id]) return -1;
                  if (!k[t.id] && k[a.id]) return 1;
                  const n = 0 === e ? 1 : -1;
                  return "modified" === S.sortField
                    ? n * (t.modified - a.modified)
                    : n * t.title.localeCompare(a.title);
                }),
              ),
              rules: (0, q.createRegExpList)(h),
              queryString: h,
              primaryKey: "title",
              secondaryKey: "description",
            });
            var e;
          }, [h, S, p, k]),
          {
            selectedItemIndex: Z,
            setSelectedItemIndex: R,
            handleKeyboardSelection: P,
          } = (function (e, t, a) {
            const [o, r] = (0, n.useState)(-1);
            return (
              (0, n.useEffect)(() => {
                var e;
                -1 !== o &&
                  (null === (e = a.current) ||
                    void 0 === e ||
                    e.scrollToItem(o));
              }, [o]),
              {
                selectedItemIndex: o,
                setSelectedItemIndex: r,
                handleKeyboardSelection: function (a) {
                  switch ((0, $.hashFromEvent)(a)) {
                    case 40:
                      if (o === e - 1) return;
                      r(o + 1);
                      break;
                    case 38:
                      if (0 === o) return;
                      if (-1 === o) return void r(o + 1);
                      r(o - 1);
                      break;
                    case 13:
                      t(a);
                  }
                },
              }
            );
          })(
            I.length,
            function (e) {
              const t = I[Z];
              if (-1 === Z || !t) return;
              0;
              t.openAction(), !1;
            },
            N,
          );
        return n.createElement(m.AdaptivePopupDialog, {
          ref: b,
          onClose: o,
          onClickOutside: o,
          onKeyDown: P,
          isOpened: !0,
          className: G.dialog,
          title: ae,
          dataName: "load-layout-dialog",
          render: function () {
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(w.DialogSearch, {
                reference: A,
                onChange: B,
                placeholder: s.t(null, void 0, a(52298)),
              }),
              n.createElement(
                L,
                { className: i()(!te && G.contentHeader) },
                n.createElement(D, { title: s.t(null, void 0, a(25653)) }),
                n.createElement(
                  v,
                  {
                    sortDirection: S.sortDirection,
                    title: s.t(null, void 0, a(41583)),
                    "data-name": "load-chart-dialog-sort-button",
                  },
                  n.createElement(C, {
                    label: s.t(null, void 0, a(63479)),
                    listSortField: S.sortField,
                    itemSortField: "title",
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 0,
                    onClick: V,
                    "data-name": "load-chart-dialog-sort-menu-item",
                  }),
                  n.createElement(C, {
                    label: s.t(null, void 0, a(96189)),
                    listSortField: S.sortField,
                    itemSortField: "title",
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 1,
                    onClick: V,
                    "data-name": "load-chart-dialog-sort-menu-item",
                  }),
                  n.createElement(C, {
                    label: s.t(null, void 0, a(38212)),
                    listSortField: S.sortField,
                    itemSortField: "modified",
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 0,
                    onClick: V,
                    "data-name": "load-chart-dialog-sort-menu-item",
                  }),
                  n.createElement(C, {
                    label: s.t(null, void 0, a(63037)),
                    listSortField: S.sortField,
                    itemSortField: "modified",
                    listSortDirection: S.sortDirection,
                    itemSortDirection: 1,
                    onClick: V,
                    "data-name": "load-chart-dialog-sort-menu-item",
                  }),
                ),
              ),
              n.createElement(T, {
                scrollbar: "native",
                reference: N,
                itemCount: I.length,
                itemSize: 52,
                className: G.contentList,
                onScroll: j,
                innerElementType: X,
                itemKey: (e) => (k[I[e].id] ? "f_" : "") + I[e].id,
                children: ({ style: e, index: t }) =>
                  n.createElement(
                    "div",
                    { style: e },
                    n.createElement(J, {
                      chart: I[t],
                      onClose: o,
                      chartWidgetCollection: d,
                      trackEvent: O,
                      onRemoveCanceled: U,
                      localFavorites: k,
                      setLocalFavorites: E,
                      searchString: h,
                      onClickRemove: W,
                      isSelected: t === Z,
                    }),
                  ),
              }),
            );
          },
          forceCloseOnEsc: F,
        });
        function j() {
          K.globalCloseDelegate.fire();
        }
        function B(e) {
          const t = e.currentTarget.value;
          f(t), R(-1);
        }
        function O(e) {
          0;
        }
        function W(e) {
          _([e, ...p]);
        }
        function H(e) {
          E(e);
        }
        function U() {
          (0, l.ensureNotNull)(b.current).focus();
        }
        function V(e, t) {
          const a = { sortField: e, sortDirection: t };
          x(a),
            c.setValue("loadChartDialog.viewState", JSON.stringify(a), {
              forceFlush: !0,
            }),
            O();
        }
      }
      var oe = a(85067);
      class re extends oe.DialogRenderer {
        constructor(e) {
          super(), (this._options = e);
        }
        show() {
          o.render(
            n.createElement(ne, {
              ...this._options,
              onClose: () => this.hide(),
            }),
            this._container,
          ),
            this._setVisibility(!0);
        }
        hide() {
          o.unmountComponentAtNode(this._container), this._setVisibility(!1);
        }
      }
    },
    645: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 7v13.5M4.5 16.5l4 4 4-4"/></svg>';
    },
    44563: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.5 18.5h-3M21.5 13.5h-5M23.5 8.5h-7M8.5 20.5V7M12.5 11l-4-4-4 4"/></svg>';
    },
    69859: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M12.4 12.5a7 7 0 1 0-4.9 2 7 7 0 0 0 4.9-2zm0 0l5.101 5"/></svg>';
    },
    20036: (e) => {
      e.exports = {
        ar: ["إلغاء"],
        ca_ES: ["Cancel·la"],
        cs: ["Zrušit"],
        de: ["Abbrechen"],
        el: ["Άκυρο"],
        en: "Cancel",
        es: ["Cancelar"],
        fa: ["لغو"],
        fr: ["Annuler"],
        he_IL: ["ביטול"],
        hu_HU: ["Törlés"],
        id_ID: ["Batal"],
        it: ["Annulla"],
        ja: ["キャンセル"],
        ko: ["취소"],
        ms_MY: ["Batal"],
        nl_NL: ["Annuleren"],
        pl: ["Anuluj"],
        pt: ["Cancelar"],
        ro: "Cancel",
        ru: ["Отмена"],
        sv: ["Avbryt"],
        th: ["ยกเลิก"],
        tr: ["İptal"],
        vi: ["Hủy bỏ"],
        zh: ["取消"],
        zh_TW: ["取消"],
      };
    },
    15795: (e) => {
      e.exports = {
        ar: ["جميع تنسيقاتي"],
        ca_ES: "All my layouts",
        cs: "All my layouts",
        de: ["Alle meine Layouts"],
        el: "All my layouts",
        en: "All my layouts",
        es: ["Todos mis diseños"],
        fa: "All my layouts",
        fr: ["Toutes mes mises en page"],
        he_IL: ["כל הפריסות שלי"],
        hu_HU: "All my layouts",
        id_ID: ["Seluruh layout saya"],
        it: ["Tutti i miei layout"],
        ja: ["すべてのレイアウト"],
        ko: ["내 모든 레이아웃"],
        ms_MY: ["Semua susun atur saya"],
        nl_NL: "All my layouts",
        pl: ["Wszystkie moje układy"],
        pt: ["Todos meus layouts"],
        ro: "All my layouts",
        ru: ["Все мои графики"],
        sv: ["Alla mina layouter"],
        th: ["เค้าโครงทั้งหมดของฉัน"],
        tr: ["Tüm yerleşimlerim"],
        vi: ["Tất cả bố cục của tôi"],
        zh: ["所有我的布局"],
        zh_TW: ["我的所有版面"],
      };
    },
    69368: (e) => {
      e.exports = {
        ar: ["هل تريد فعلا مسح تصميم مخطط الرسم البيانى‎ ‎{name}‎؟"],
        ca_ES: ["De debò que voleu eliminar el disseny del gràfic '{name}'?"],
        cs: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        de: ["Möchten Sie das Chartlayout '{name}' wirklich löschen?"],
        el: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        en: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        es: [
          "¿Está seguro de que desea eliminar el Diseño del gráfico '{name}'?",
        ],
        fa: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        fr: [
          "Voulez-vous vraiment supprimer la configuration du graphique '{name}' ?",
        ],
        he_IL: ["האם אתה באמת רוצה למחוק פריסת גרף '{name}'?"],
        hu_HU: ["Biztos, hogy törölni akarod ezt a chart elrendezést: {name}?"],
        id_ID: ["Apakah benar anda ingin menghapus Layout RealtimeChart '{name}' ?"],
        it: ["Cancellare la configurazione '{name}' ?"],
        ja: ["本当にチャートレイアウト '{name}' を削除しますか？"],
        ko: ["정말로 차트 레이아웃 '{name}' 을 지우시겠습니까?"],
        ms_MY: ["Anda benar-benar ingin memadam Susunatur Carta '{name}' ?"],
        nl_NL: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        pl: ["Czy na pewno chcesz usunąć układ graficzny '{name}'?"],
        pt: ["Você quer realmente deletar o leiaute do gráfico '{name}'?"],
        ro: "Do you really want to delete RealtimeChart Layout '{name}' ?",
        ru: ['Вы действительно хотите удалить сохранённый график "{name}"?'],
        sv: ["Vill du verkligen ta bort diagramlayout '{name}' ?"],
        th: ["คุณต้องการลบชาทส์ '{name}' จริง ๆ หรือไม?"],
        tr: [
          "'{name}' isimli Grafik Yerleşimini silmek istediğinizden emin misiniz?",
        ],
        vi: ["Bạn có thực sự muốn xóa Bố cục Biểu đồ {name}?"],
        zh: ["确定删除图表布局'{name}' ?"],
        zh_TW: ["確定刪除圖表版面「{name}」？"],
      };
    },
    58013: (e) => {
      e.exports = {
        ar: [
          'هل تريد حقًا حذف تنسيق ارسم البياني "{name}" الذي يحتوي على ‎{n_drawings_on_n_symbols}‎؟',
        ],
        ca_ES: [
          "De debò que voleu eliminar el disseny del gràfic '{name}' que conté {n_drawings_on_n_symbols}?",
        ],
        cs: "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        de: [
          "Möchten Sie wirklich das RealtimeChart-Layout '{name}' löschen, das {n_drawings_on_n_symbols} enthält?",
        ],
        el: "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        en: "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        es: [
          "¿Realmente quiere eliminar el diseño del gráfico '{name}' que contiene {n_drawings_on_n_symbols}?",
        ],
        fa: "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        fr: [
          'Voulez-vous vraiment supprimer le modèle de graphique " {name} " qui contient {n_drawings_on_n_symbols}?',
        ],
        he_IL: [
          "האם אתה באמת רוצה למחוק את פריסת הגרף '{name}' שמכילה {n_drawings_on_n_symbols}?",
        ],
        hu_HU:
          "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        id_ID: [
          "Apakah Anda benar-benar ingin menghapus Layout RealtimeChart '{name}' yang berisi {n_drawings_on_n_symbols}?",
        ],
        it: [
          "Vuoi davvero eliminare il salvataggio '{name}' che contiene {n_drawings_on_n_symbols}?",
        ],
        ja: [
          "本当に{n_drawings_on_n_symbols}を含むチャートレイアウト「{name}」を削除しますか？",
        ],
        ko: [
          "{n_drawings_on_n_symbols}이 포함된 차트 레이아웃 '{name}'을 삭제하시겠습니까?",
        ],
        ms_MY: [
          "Adakah anda pasti untuk padamkan Susun Atur Carta '{name}' yang mengandungi {n_drawings_on_n_symbols}?",
        ],
        nl_NL:
          "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        pl: [
          "Czy na pewno chcesz usunąć układ wykresu '{name}', który zawiera {n_drawings_on_n_symbols}?",
        ],
        pt: [
          "Você realmente quer deletar o Layout do Gráfico '{name}' que contém {n_drawings_on_n_symbols}?",
        ],
        ro: "Do you really want to delete RealtimeChart Layout '{name}' that contains {n_drawings_on_n_symbols}?",
        ru: [
          'Вы действительно хотите удалить график "{name}", который содержит {n_drawings_on_n_symbols}?',
        ],
        sv: [
          "Ska du verkligen radera diagramlayout '{name}' som innehåller {n_drawings_on_n_symbols}?",
        ],
        th: [
          "คุณต้องการลบเลยเอาต์ชาร์ต '{name}' ที่มี {n_drawings_on_n_symbols} หรือไม่?",
        ],
        tr: [
          "{n_drawings_on_n_symbols} içeren Grafik Düzenini '{name}' gerçekten silmek istiyor musunuz?",
        ],
        vi: [
          "Bạn có thực sự muốn xóa Bố cục Biểu đồ '{name}' có chứa {n_drawings_on_n_symbols} không?",
        ],
        zh: ["您真的要删除包含{n_drawings_on_n_symbols}的图表布局“{name}”吗？"],
        zh_TW: [
          "您真的要刪除包含{n_drawings_on_n_symbols}的圖表版面“{name}”嗎？",
        ],
      };
    },
    38212: (e) => {
      e.exports = {
        ar: ["تاريخ التعديل (الأقدم أولاً)"],
        ca_ES: ["Data de modificació (la més antiga primer)"],
        cs: "Date modified (oldest first)",
        de: ["Bearbeitungs-Datum (ältestes zuerst)"],
        el: "Date modified (oldest first)",
        en: "Date modified (oldest first)",
        es: ["Fecha de modificación (la más antigua primero)"],
        fa: "Date modified (oldest first)",
        fr: ["Date de modification (la plus ancienne d'abord)"],
        he_IL: ["התאריך שונה (הישן ראשון)"],
        hu_HU: "Date modified (oldest first)",
        id_ID: ["Tanggal modifikasi (dari yang terlama)"],
        it: ["Data ultima modifica (vecchi prima)"],
        ja: ["変更日 (古い順)"],
        ko: ["바뀐 날짜 (옛것부터)"],
        ms_MY: ["Tarikh diubah (lama dahulu)"],
        nl_NL: "Date modified (oldest first)",
        pl: ["Data modyfikacji (od najstarszych)"],
        pt: ["Data da modificação (mais antiga primeiro)"],
        ro: "Date modified (oldest first)",
        ru: ["Дата изменения (сначала старые)"],
        sv: ["Ändringsdatum (äldst först)"],
        th: ["วันที่แก้ไข (เก่าก่อน)"],
        tr: ["Değişim tarihine göre sırala (önce en eski)"],
        vi: ["Ngày chỉnh sửa (cũ lên trước)"],
        zh: ["修改日期(由旧到新)"],
        zh_TW: ["修改日期(舊到新)"],
      };
    },
    63037: (e) => {
      e.exports = {
        ar: ["تاريخ التعديل (الأحدث أولاً)"],
        ca_ES: ["Data de modificació (la més nova primer)"],
        cs: "Date modified (newest first)",
        de: ["Bearbeitungs-Datum (neuestes zuerst)"],
        el: "Date modified (newest first)",
        en: "Date modified (newest first)",
        es: ["Fecha de modificación (la más reciente primero)"],
        fa: "Date modified (newest first)",
        fr: ["Date de modification (la plus récente d'abord)"],
        he_IL: ["התאריך שונה (החדש ראשון)"],
        hu_HU: "Date modified (newest first)",
        id_ID: ["Tanggal modifikasi (dari yang terbaru)"],
        it: ["Data ultima modifica (recenti prima)"],
        ja: ["変更日 (新しい順)"],
        ko: ["바뀐 날짜 (새것부터)"],
        ms_MY: ["Tarikh diubah (terbaru dahulu)"],
        nl_NL: "Date modified (newest first)",
        pl: ["Data modyfikacji (od najnowszych)"],
        pt: ["Data da modificação (mais recente 1°)"],
        ro: "Date modified (newest first)",
        ru: ["Дата изменения (сначала новые)"],
        sv: ["Ändringsdatum (nyast först)"],
        th: ["วันที่แก้ไข (ใหม่ก่อน)"],
        tr: ["Değişim tarihine göre sırala (önce en yeni)"],
        vi: ["Ngày chỉnh sửa (mới lên trước)"],
        zh: ["修改日期(由新到旧)"],
        zh_TW: ["修改日期(新到舊)"],
      };
    },
    75789: (e) => {
      e.exports = {
        ar: ["تحميل التنسيق"],
        ca_ES: ["Carrega disseny"],
        cs: "Load layout",
        de: ["Layout öffnen"],
        el: "Load layout",
        en: "Load layout",
        es: ["Cargar diseño"],
        fa: "Load layout",
        fr: ["Charger la mise en page"],
        he_IL: ["טען גרף"],
        hu_HU: "Load layout",
        id_ID: ["Muat layout"],
        it: ["Carica layout"],
        ja: ["レイアウトの読み込み"],
        ko: ["레이아웃 불러오기"],
        ms_MY: ["Memuatkan susun atur"],
        nl_NL: "Load layout",
        pl: ["Załaduj układ"],
        pt: ["Carregar layout"],
        ro: "Load layout",
        ru: ["Загрузить график"],
        sv: ["Ladda layout"],
        th: ["โหลดเลย์เอาท์"],
        tr: ["Yerleşimi yükle"],
        vi: ["Tải bố cục"],
        zh: ["加载布局"],
        zh_TW: ["加載版面"],
      };
    },
    25653: (e) => {
      e.exports = {
        ar: ["اسم التنسيق"],
        ca_ES: ["Nom del disseny del gràfic"],
        cs: "Layout name",
        de: ["Layout Name"],
        el: "Layout name",
        en: "Layout name",
        es: ["Nombre del diseño del gráfico"],
        fa: "Layout name",
        fr: ["Nom de la mise en page"],
        he_IL: ["שם פריסת גרף"],
        hu_HU: "Layout name",
        id_ID: ["Nama Layout"],
        it: ["Nome layout"],
        ja: ["レイアウト名"],
        ko: ["레이아웃 네임"],
        ms_MY: ["Aturan nama"],
        nl_NL: "Layout name",
        pl: ["Nazwa układu"],
        pt: ["Nome do layout"],
        ro: "Layout name",
        ru: ["Имя графика"],
        sv: ["Layoutnamn"],
        th: ["ชื่อเลย์เอาท์"],
        tr: ["Yerleşim adı"],
        vi: ["Tên bố cục"],
        zh: ["布局名称"],
        zh_TW: ["版面名稱"],
      };
    },
    63479: (e) => {
      e.exports = {
        ar: ["اسم التنسيق (A إلى Z)"],
        ca_ES: ["Nom de disseny (de la A a la Z)"],
        cs: "Layout name (A to Z)",
        de: ["Layout Name (A bis Z)"],
        el: "Layout name (A to Z)",
        en: "Layout name (A to Z)",
        es: ["Nombre de diseño (de la A a la Z)"],
        fa: "Layout name (A to Z)",
        fr: ["Nom de la mise en page (A à Z)"],
        he_IL: ["שם הפריסה (א' עד ת')"],
        hu_HU: "Layout name (A to Z)",
        id_ID: ["Nama layout (A ke Z)"],
        it: ["Nome layout (A-Z)"],
        ja: ["レイアウト名 (AからZ)"],
        ko: ["레이아웃 이름 (A - Z)"],
        ms_MY: ["Nama susun atur (A hingga Z)"],
        nl_NL: "Layout name (A to Z)",
        pl: ["Nazwa układu (A do Z)"],
        pt: ["Nome do layout (A a Z)"],
        ro: "Layout name (A to Z)",
        ru: ["Название графиков (А → Я)"],
        sv: ["Layoutnamn (A till Z)"],
        th: ["ชื่อเลย์เอาท์ (A ไปยัง Z)"],
        tr: ["Yerleşim adı (A'dan Z'ye)"],
        vi: ["Tên bố cục (A đến Z)"],
        zh: ["布局名称(A到Z)"],
        zh_TW: ["版面名稱(A到Z)"],
      };
    },
    96189: (e) => {
      e.exports = {
        ar: ["اسم التنسيق (Z إلى A)"],
        ca_ES: ["Nom de disseny (de la Z a la A)"],
        cs: "Layout name (Z to A)",
        de: ["Layout Name (Z-A)"],
        el: "Layout name (Z to A)",
        en: "Layout name (Z to A)",
        es: ["Nombre de diseño (de la Z a la A)"],
        fa: "Layout name (Z to A)",
        fr: ["Nom de la mise en page (Z à A)"],
        he_IL: ["שם הפריסה (ת' עד א')"],
        hu_HU: "Layout name (Z to A)",
        id_ID: ["Nama layout (Z ke A)"],
        it: ["Nome layout (Z-A)"],
        ja: ["レイアウト名 (ZからA)"],
        ko: ["레이아웃 이름 (Z - A)"],
        ms_MY: ["Nama susun atur (Z hingga A)"],
        nl_NL: "Layout name (Z to A)",
        pl: ["Nazwa układu (Z do A)"],
        pt: ["Nome do layout (Z a A)"],
        ro: "Layout name (Z to A)",
        ru: ["Название графиков (Я → А)"],
        sv: ["Layoutnamn (Z till A)"],
        th: ["ชื่อเลย์เอาท์ (Z ไปยัง A)"],
        tr: ["Yerleşim adı (Z'den A'ya)"],
        vi: ["Tên bố cục (Z đến A)"],
        zh: ["布局名称(Z到A)"],
        zh_TW: ["版面名稱(Z到A)"],
      };
    },
    41583: (e) => {
      e.exports = {
        ar: ["تصنيف حسب اسم التنسيق، وتاريخ التعديل"],
        ca_ES: ["Ordena per nom de disseny del gràfic, data de modificació"],
        cs: "Sort by layout name, date changed",
        de: ["Nach Layout-Name sortieren, Änderungsdatum"],
        el: "Sort by layout name, date changed",
        en: "Sort by layout name, date changed",
        es: ["Ordenar por nombre de diseño del gráfico, fecha de modificación"],
        fa: "Sort by layout name, date changed",
        fr: ["Trier par nom de mise en page, date modifiée"],
        he_IL: ["מיין לפי שם הפריסה layout , התאריך השתנה"],
        hu_HU: "Sort by layout name, date changed",
        id_ID: ["Urut berdasarkan nama layout, tanggal perubahan"],
        it: ["Ordina in base a nome, data"],
        ja: ["レイアウト名や変更日で並び替え"],
        ko: ["레이아웃 네임, 바뀐 날짜로 소팅"],
        ms_MY: ["Susun mengikut aturan nama, perubahan tarikh"],
        nl_NL: "Sort by layout name, date changed",
        pl: ["Sortuj według nazwy układu, data zmiany"],
        pt: ["Ordenar por nome do layout, data de alteração"],
        ro: "Sort by layout name, date changed",
        ru: ["Сортировать по имени, дате изменения"],
        sv: ["Sortera med layoutnamn, datum ändrat"],
        th: ["เรียงตามชื่อเลย์เอาท์, วันที่เปลี่ยนแปลง"],
        tr: ["Yerleşim adına, tarih değişikliğine göre sırala"],
        vi: ["Sắp xếp theo tên bố cục, ngày thay đổi"],
        zh: ["排序依布局名称、修改日期"],
        zh_TW: ["排序按版面名稱、修改日期"],
      };
    },
    52298: (e) => {
      e.exports = {
        ar: ["بحث"],
        ca_ES: ["Cercar"],
        cs: ["Hledat"],
        de: ["Suche"],
        el: ["Αναζήτησή"],
        en: "Search",
        es: ["Buscar"],
        fa: ["جستجو"],
        fr: ["Chercher"],
        he_IL: ["חפש"],
        hu_HU: ["Keresés"],
        id_ID: ["Cari"],
        it: ["Cerca"],
        ja: ["検索"],
        ko: ["찾기"],
        ms_MY: ["Cari"],
        nl_NL: ["Zoeken"],
        pl: ["Szukaj"],
        pt: ["Pesquisar"],
        ro: "Search",
        ru: ["Поиск"],
        sv: ["Sök"],
        th: ["ค้นหา"],
        tr: ["Ara"],
        vi: ["Tìm kiếm"],
        zh: ["搜索"],
        zh_TW: ["搜尋"],
      };
    },
    39966: (e) => {
      e.exports = {
        ar: [
          "على {amount} من الرموز",
          "على {amount} من الرموز",
          "على {amount} من الرموز",
          "على {amount} من الرموز",
          "على {amount} من الرموز",
          "على {amount} من الرموز",
        ],
        ca_ES: ["en {amount} símbol", "en {amount} símbols"],
        cs: "on {amount} symbol",
        de: ["auf {amount} Symbol", "auf {amount} Symbolen"],
        el: "on {amount} symbol",
        en: "on {amount} symbol",
        es: ["en {amount} símbolo", "en {amount} símbolos"],
        fa: ["on {amount} symbols"],
        fr: ["sur {amount} symbole", "sur {amount} symbols"],
        he_IL: [
          "על סימול {amount}",
          "על סימולים {amount}",
          "על סימולים {amount}",
          "על סימולים {amount}",
        ],
        hu_HU: ["on {amount} symbols"],
        id_ID: ["pada {amount} simbol"],
        it: ["su {amount} simbolo", "su {amount} simboli"],
        ja: ["（{amount}個のシンボル上に）"],
        ko: ["on {amount} 심볼"],
        ms_MY: ["pada simbol {amount}"],
        nl_NL: "on {amount} symbol",
        pl: [
          "na {amount} symbolu",
          "na {amount} symbolach",
          "na {amount} symbolach",
          "na {amount} symbolach",
        ],
        pt: ["em {amount} símbolo", "em {amount} símbolos"],
        ro: "on {amount} symbol",
        ru: [
          "на {amount} инструменте",
          "на {amount} инструментах",
          "на {amount} инструментах",
          "на {amount} инструментах",
        ],
        sv: ["på {amount} symbol", "på {amount} symboler"],
        th: ["บน {amount} สัญลักษณ์"],
        tr: ["{amount} sembolünde", "{amount} sembolünde"],
        vi: ["trên {amount} mã giao dịch"],
        zh: ["在{amount}个商品"],
        zh_TW: ["在{amount}商品"],
      };
    },
    93030: (e) => {
      e.exports = {
        ar: [
          "{amount} من الرسوم ",
          "{amount} من الرسوم ",
          "{amount} من الرسوم ",
          "{amount} من الرسوم ",
          "{amount} من الرسوم ",
          "{amount} من الرسوم ",
        ],
        ca_ES: ["{amount} dibuix", "{amount} dibuixos"],
        cs: "{amount} drawing",
        de: ["{amount} Zeichnung", "{amount} Zeichnungen"],
        el: "{amount} drawing",
        en: "{amount} drawing",
        es: ["{amount} dibujo", "{amount} dibujos"],
        fa: ["{amount} drawings"],
        fr: ["{amount} dessin", "{amount} dessins"],
        he_IL: [
          "שרטוט {amount}",
          "שרטוטים {amount}",
          "שרטוטים {amount}",
          "שרטוטים {amount}",
        ],
        hu_HU: ["{amount} drawings"],
        id_ID: ["{amount} gambar"],
        it: ["{amount} disegno", "{amount} disegni"],
        ja: ["{amount}個の描画"],
        ko: ["{amount} 드로잉"],
        ms_MY: ["{amount} lukisan"],
        nl_NL: "{amount} drawing",
        pl: [
          "{amount} rysunek",
          "{amount} rysunki",
          "{amount} rysunków",
          "{amount} rysunków",
        ],
        pt: ["{amount} desenho", "{amount} desenhos"],
        ro: "{amount} drawing",
        ru: [
          "{amount} объект рисования",
          "{amount} объекта рисования",
          "{amount} объектов рисования",
          "{amount} объектов рисования",
        ],
        sv: ["{amount} ritning", "{amount} ritningar"],
        th: ["{amount} การวาด"],
        tr: ["{amount} çizim", "{amount} çizim"],
        vi: ["{amount} bản vẽ"],
        zh: ["{amount}个绘图"],
        zh_TW: ["{amount}繪圖"],
      };
    },
  },
]);
