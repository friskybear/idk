import autoAnimate, { AnimationController } from "@formkit/auto-animate";
import { debounce, throttle } from "lodash";
import { createSwapy } from "swapy";

// helps triggering a mutation
export function trigger_small_mutation() {
    const comment = document.createComment("mutation-trigger");
    document.body.appendChild(comment);
    document.body.removeChild(comment);
  }

export class AutoAnimateManager {

  private static instance: AutoAnimateManager;
  private observer: MutationObserver;
  private is_animation_disabled: boolean = false;
  private animation_controllers: Map<HTMLElement, AnimationController> = new Map();

  private constructor(init_state:boolean) {
    this.is_animation_disabled = init_state;
    // Set up the MutationObserver
    this.observer = new MutationObserver((mutations) => {
        this.apply_auto_animate(mutations)
    });

    // Start observing the document
    this.observer.observe(document.body, { childList: true,characterData:true, subtree: true });
  }

  // Singleton instance to ensure only one manager is created
  public static get_instance(state?:boolean): AutoAnimateManager {

    if (!AutoAnimateManager.instance) {
      AutoAnimateManager.instance = new AutoAnimateManager(state||false);
    }
    return AutoAnimateManager.instance;
  }



  // Internal function to handle applying animations on new elements
  private apply_auto_animate(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {

        const element = node as HTMLElement;

        // enable drag and drop
        if (element.classList && element.classList.contains("swapy")) {
            createSwapy(element,{animation:"dynamic"}).enable(true);
        }


        if (element.classList && element.classList.contains("animate")) {
          // Check if the element is already being animated
          let controller = this.animation_controllers.get(element);

          if (!controller) {
            controller = autoAnimate(element, { disrespectUserMotionPreference: true });
            this.animation_controllers.set(element, controller);
          }

          // Apply current animation state (enabled/disabled)
          this.is_animation_disabled ? controller.disable() : controller.enable();
        }
      });
      mutation.removedNodes.forEach((node)=>{
        const element = node as HTMLElement;
        if (element.nodeType === 1 && element.classList.contains("animate")) {
            this.animation_controllers.delete(element);
        }
      })
    });
  }

  // Getter for disableAnimation
  public get get_animation_status(): boolean {
    return this.is_animation_disabled;
  }

  // Setter for disableAnimation
  public set animation_status(value: boolean) {
    if (value !== this.is_animation_disabled) {
      this.is_animation_disabled = value;
      this.update_all_controllers();
    }
  }

  // Update all animation controllers when enabling/disabling animations
  private update_all_controllers() {
    this.animation_controllers.forEach((controller) => {
      this.is_animation_disabled ? controller.disable() : controller.enable();
    });
  }
}
