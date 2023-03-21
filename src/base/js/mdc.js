/**
 * Infy Scroll
 * @copyright (c) 2020 Roy Six
 * @license https://github.com/sixcious/infy-scroll/blob/main/LICENSE
 */

/**
 * MDC is a class that contains all the Material Design Components that are being used.
 * Each component is stored in a Map with its element's ID as the key and the component as the value.
 */
class MDC {

  /**
   * Fields
   *
   * @param {Map} buttons
   * @param {Map} checkboxes
   * @param {Map} chipsets
   * @param {Map} chips
   * @param {Map} dialogs
   * @param {Map} drawers
   * @param {Map} fabs
   * @param {Map} formFields
   * @param {Map} linearProgresses
   * @param {Map} lists
   * @param {Map} radios
   * @param {Map} selects
   * @param {Map} snackbars
   * @param {Map} switches
   * @param {Map} tabBars
   * @param {Map} tables
   * @param {Map} textFields
   */
  static buttons = new Map([].map.call(document.querySelectorAll('.mdc-button'), function (el) {
    return [el.id, new mdc.ripple.MDCRipple(el)];
  }));

  // static cards = new Map([].map.call(document.querySelectorAll('.mdc-card__primary-action'), function (el) {
  //   return [el.id, new mdc.ripple.MDCRipple(el)];
  // }));

  static checkboxes = new Map([].map.call(document.querySelectorAll('.mdc-checkbox'), function (el) {
    return [el.id, new mdc.checkbox.MDCCheckbox(el)];
  }));

  static chipsets = new Map([].map.call(document.querySelectorAll('.mdc-chip-set'), function (el) {
    return [el.id, new mdc.chips.MDCChipSet(el)];
  }));

  static chips = new Map([].map.call(document.querySelectorAll('.mdc-chip'), function (el) {
    return [el.id, new mdc.chips.MDCChip(el)];
  }));

  static dialogs = new Map([].map.call(document.querySelectorAll('.mdc-dialog'), function (el) {
    return [el.id, new mdc.dialog.MDCDialog(el)];
  }));

  static drawers = new Map([].map.call(document.querySelectorAll('.mdc-drawer'), function (el) {
    return [el.id, new mdc.drawer.MDCDrawer(el)];
  }));

  static fabs = new Map([].map.call(document.querySelectorAll('.mdc-fab'), function (el) {
    return [el.id, new mdc.ripple.MDCRipple(el)];
  }));

  static formFields = new Map([].map.call(document.querySelectorAll('.mdc-form-field'), function (el) {
    return [el.id, new mdc.formField.MDCFormField(el)];
  }));

  static linearProgresses = new Map([].map.call(document.querySelectorAll('.mdc-linear-progress'), function (el) {
    return [el.id, new mdc.linearProgress.MDCLinearProgress(el)];
  }));

  static lists = new Map([].map.call(document.querySelectorAll('.mdc-list'), function (el) {
    // Add lists with ripple for each list item
    const list = new mdc.list.MDCList(el);
    list.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));
    list.singleSelection = true;
    return [el.id, list];
  }));

  static radios = new Map([].map.call(document.querySelectorAll('.mdc-radio'), function (el) {
    return [el.id, new mdc.radio.MDCRadio(el)];
  }));

  static selects = new Map([].map.call(document.querySelectorAll('.mdc-select'), function (el) {
    return [el.id, new mdc.select.MDCSelect(el)];
  }));

  static snackbars = new Map([].map.call(document.querySelectorAll('.mdc-snackbar'), function (el) {
    return [el.id, new mdc.snackbar.MDCSnackbar(el)];
  }));

  static switches = new Map([].map.call(document.querySelectorAll('.mdc-switch'), function (el) {
    return [el.id, new mdc.switchControl.MDCSwitch(el)];
  }));

  static tabBars = new Map([].map.call(document.querySelectorAll('.mdc-tab-bar'), function (el) {
    return [el.id, new mdc.tabBar.MDCTabBar(el)];
  }));

  static tables = new Map([].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
    return [el.id, new mdc.dataTable.MDCDataTable(el)];
  }));

  static textFields = new Map([].map.call(document.querySelectorAll('.mdc-text-field'), function (el) {
    return [el.id, new mdc.textField.MDCTextField(el)];
  }));

  // TODO: Migrate to MDC Tooltips at some point when we upgrade the MDC version? (Balloon's Tooltips are better)
  // static tooltips = new Map([].map.call(document.querySelectorAll('.mdc-tooltip'), function (el) {
  //   return [el.id, new mdc.ripple.MDCRipple(el)];
  // }));

  /**
   * Performs a layout for each applicable MDC object. An MDC object needs to run layout each time it is displayed or
   * is shown again after being hidden (e.g. display: none).
   *
   * @public
   */
  static layout() {
    MDC.selects.forEach(el => el.layout());
    MDC.textFields.forEach(el => {
      // If the text field input is empty (no value), remove the float-above from the label so it doesn't look broken
      if (el.input_ && el.label_?.root_) {
        if (!el.input_.value) {
          el.label_.root_.classList.remove("mdc-floating-label--float-above");
        } else {
          el.label_.root_.classList.add("mdc-floating-label--float-above");
        }
      }
      el.layout();
    });
  }

  /**
   * Performs a resize for MDC objects, specifically textareas. This is called separately from layout and only after the
   * element is confirmed to be painted on the screen.
   *
   * @public
   */
  static resize() {
    MDC.textFields.forEach(el => {
      if (el.input_.scrollHeight > 0 && el.input_.nodeName.toUpperCase() === "TEXTAREA") {
        el.input_.style.height = el.input_.scrollHeight + "px";
        el.layout();
      }
    });
  }

  /**
   * Opens the MDC Snackbar.
   *
   * @param {string} labelText - the text the snackbar should display
   * @param {number} timeoutMs - the milliseconds the snackbar should be active for, the minimum is 4000 ms and -1 is infinite (until closed)
   * @param {string} snackbarId - the id of the snackbar to use (e.g. "mdc-snackbar" or "mdc-snackbar-undo")
   * @public
   */
  static openSnackbar(labelText, timeoutMs = 5000, snackbarId = "mdc-snackbar") {
    // Close any previously open snackbars so they don't cover up the newest snackbar and to avoid issues like deleting and then adding new saves right afterwards
    [...MDC.snackbars.values()].forEach(snackbar => snackbar.close());
    const snackbar = MDC.snackbars.get(snackbarId);
    // Can't make snackbar timeoutMs lower than 4000?
    snackbar.timeoutMs = timeoutMs;
    // Since we're reusing the same snackbar, we need to reset the labelText before we open it, then set it after we open
    snackbar.labelText = "";
    snackbar.open();
    snackbar.labelText = labelText;
  }

}