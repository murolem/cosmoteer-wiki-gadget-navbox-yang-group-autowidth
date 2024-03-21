import { getLoggers } from '$utils/log';
// remove if your gadget doesn't use any styles
// import './styles.pcss'

var loggers = getLoggers();
var logInfo = loggers.logInfo;
var logWarn = loggers.logWarn;
var logError = loggers.logError;

// hook to the content event
mw.hook('wikipage.content').add((content: JQuery) => {
    // underlying element
    var root = content.get()[0];

    // search for any navbox section within the changed content
    var sections = Array.from<HTMLElement>(root.querySelectorAll('.navbox-section'));
    if (sections.length === 0) {
        logInfo(`"content" event fired → no navbox sections found`);
    } else {
        logInfo(`"content" event fired → found navbox sections (${sections.length}):\n`, [sections]);
    }

    // iterate over each found section, if any
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];

        // get the content element from which to start the iteration
        var sectionContent = section.querySelector<HTMLElement>(':scope > .navbox-section-content');
        if (!sectionContent) {
            logError("navbox section content element not found", [section], { throwErr: true });
            throw '' // type guard
        }

        // run align function for every nested group
        alignGroupsIncludingNested(sectionContent);
    }
})





/**
 * Given a container element that has in its children navbox groups, 
 * finds the widest group's title element and assignes that width to every other sibling
 * navbox group.
 * 
 * Then it calls itself for every found navbox group's content container, 
 * repeating the process.
 */
function alignGroupsIncludingNested(group: HTMLElement) {
    // get child groups
    var childGroups = Array.from<HTMLElement>(
        group.querySelectorAll(':scope > .navbox-group')
    );

    // if no groups were found, stop execution
    if (childGroups.length === 0) {
        return;
    }

    // get the child group's title elements
    var childGroupsTitles = childGroups
        .map(group => {
            var result = group.querySelector<HTMLElement>(':scope > .navbox-group-title');
            if (!result) {
                logError("navbox group title element not found", [group], { throwErr: true });
            }
            return result!;
        });

    // find the width of the widest group's title element
    var childGroupsWidestTitleWidthPx = childGroupsTitles.reduce((maxWidth, titleEl) => {
        var groupWidth = titleEl.offsetWidth;
        if (groupWidth > maxWidth)
            return groupWidth;
        else
            return maxWidth;
    }, 0);

    // this addition hopefully should prevent elements from wrapping because they
    // are missing a few pixels to NOT wrap.
    // I'm not sure what causes the wrapping without this modification,
    // but if wrapping DOES happen anyway, maybe this is a reason way.
    childGroupsWidestTitleWidthPx = Math.ceil(childGroupsWidestTitleWidthPx + 1);

    // define a new css variable set to the group that contains
    // the max width found.
    // this is just a more "clear" way to set the width, and might help in debugging any issues later.
    group.style.setProperty("--child-groups-title-width", `${childGroupsWidestTitleWidthPx}px`);

    // set every child group's title min-width to the css variable.
    // min-width is used because it can be set to 0 as its initial value,
    // and create a smooth transition to the width set in here without
    // making elements appear with 0 width.
    childGroupsTitles
        .forEach(titleEl => titleEl.style['minWidth'] = 'var(--child-groups-title-width)');

    // repeat for every child element, calling the align function on the content container
    for (var j = 0; j < childGroups.length; j++) {
        var childGroup = childGroups[j];
        var contentContainer = (() => {
            var result = childGroup.querySelector<HTMLElement>(':scope > .navbox-group-content');
            if (!result) {
                logError("navbox group content element not found", [childGroup], { throwErr: true });
                throw '' // type guard
            }
            return result;
        })();

        alignGroupsIncludingNested(contentContainer);
    }
}

type StopListeneingCb = () => void;

/**
 * Calls `cb` each time an element (or elements) matching given selector are added to the page.
 * @param selector The selector to match new elements against.
 * @param cb A callback to run when an element (or elements) are added that match the `selector`.
 * @returns A callback to stop listening for changes.
 */
function listenForElementsAppends(
    selector: string,
    cb: (els: HTMLElement[], stopListening: StopListeneingCb) => void
): StopListeneingCb {
    var observer = new MutationObserver(mutations => {
        var matchingEls = document.querySelectorAll<HTMLElement>(selector)
        if (matchingEls.length > 0) {
            cb([...matchingEls], () => observer.disconnect());
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    return () => observer.disconnect();
}