/*
 * gadget: Provides an automatic width calculation of {{Navbox}} group.
 * authors: aliser.
 * documentation and master version: https://github.com/murolem/cosmoteer-wiki-gadget-navbox-yang-group-autowidth
 * license: MIT
*/

var gadgetName = "gadget-navbox-yang-group-autowidth";
var loggerPrefix = gadgetName;
function getLoggers() {
  return {
    /**
     * Log messages using `console.log`.
     * @param message First message to log.
     * @param moreMessages Any additional messages to log.
     */
    logInfo: function(message, moreMessages) {
      console.log.apply(null, ["[".concat(loggerPrefix, "] ").concat(message)].concat(moreMessages != null ? moreMessages : []));
    },
    /**
    * Log warning messages using `mw.log.warn`.
    * @param message First message to log.
    * @param moreMessages Any additional messages to log.
    */
    logWarn: function(message, moreMessages) {
      mw.log.warn.apply(null, ["[".concat(loggerPrefix, "] ").concat(message)].concat(moreMessages != null ? moreMessages : []));
    },
    /**
     * Log error messages using `mw.log.error`.
     * @param message First message to log.
     * @param moreMessages Any additional messages to log.
     * @param opts Options.
     */
    logError: function(message, moreMessages, opts) {
      var defaulOpts = {
        throwErr: false
      };
      opts = Object.assign(defaulOpts, opts != null ? opts : {});
      mw.log.error.apply(null, ["[".concat(loggerPrefix, "] ").concat(message)].concat(moreMessages != null ? moreMessages : []));
      if (opts.throwErr) {
        throw new Error("[".concat(loggerPrefix, "] an error occured - see output above for details"));
      }
    }
  };
}
var loggers = getLoggers();
var logInfo = loggers.logInfo;
var logError = loggers.logError;
mw.hook("wikipage.content").add(function(content) {
  var root = content.get()[0];
  var sections = Array.from(root.querySelectorAll(".navbox-section"));
  if (sections.length === 0) {
    logInfo('"content" event fired → no navbox sections found');
  } else {
    logInfo('"content" event fired → found navbox sections ('.concat(sections.length, "):\n"), [sections]);
  }
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var sectionContent = section.querySelector(":scope > .navbox-section-content");
    if (!sectionContent) {
      logError("navbox section content element not found", [section], { throwErr: true });
      throw "";
    }
    alignGroupsIncludingNested(sectionContent);
  }
});
function alignGroupsIncludingNested(group) {
  var childGroups = Array.from(
    group.querySelectorAll(":scope > .navbox-group")
  );
  if (childGroups.length === 0) {
    return;
  }
  var childGroupsTitles = childGroups.map(function(group2) {
    var result = group2.querySelector(":scope > .navbox-group-title");
    if (!result) {
      logError("navbox group title element not found", [group2], { throwErr: true });
    }
    return result;
  });
  var childGroupsWidestTitleWidthPx = childGroupsTitles.reduce(function(maxWidth, titleEl) {
    var groupWidth = titleEl.offsetWidth;
    if (groupWidth > maxWidth)
      return groupWidth;
    else
      return maxWidth;
  }, 0);
  childGroupsWidestTitleWidthPx = Math.ceil(childGroupsWidestTitleWidthPx + 1);
  group.style.setProperty("--child-groups-title-width", "".concat(childGroupsWidestTitleWidthPx, "px"));
  childGroupsTitles.forEach(function(titleEl) {
    return titleEl.style["minWidth"] = "var(--child-groups-title-width)";
  });
  for (var j = 0; j < childGroups.length; j++) {
    var childGroup = childGroups[j];
    var contentContainer = function() {
      var result = childGroup.querySelector(":scope > .navbox-group-content");
      if (!result) {
        logError("navbox group content element not found", [childGroup], { throwErr: true });
        throw "";
      }
      return result;
    }();
    alignGroupsIncludingNested(contentContainer);
  }
}
