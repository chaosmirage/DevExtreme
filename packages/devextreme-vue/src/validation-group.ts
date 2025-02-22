import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import ValidationGroup, { Properties } from "devextreme/ui/validation_group";
import {
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
} from "devextreme/ui/validation_group";

type AccessibleOptions = Pick<Properties,
  "elementAttr" |
  "height" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "width"
>;

interface DxValidationGroup extends AccessibleOptions {
  readonly instance?: ValidationGroup;
}

const componentConfig = {
  props: {
    elementAttr: Object as PropType<Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:width": null,
  },
  computed: {
    instance(): ValidationGroup {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = ValidationGroup;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxValidationGroup = defineComponent(componentConfig);

export default DxValidationGroup;
export {
  DxValidationGroup
};
import type * as DxValidationGroupTypes from "devextreme/ui/validation_group_types";
export { DxValidationGroupTypes };
