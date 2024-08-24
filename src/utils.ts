import { AutoAnimateManager } from "./utils/animation";

export class AppManager {

    public animation_manager: AutoAnimateManager;

    constructor({  animation_status }: {  animation_status?: boolean }) {
        this.animation_manager = AutoAnimateManager.get_instance(animation_status || false);
    }
    /**
     * set_animation_status
     */
    public set_animation_status(status:boolean) {
        this.animation_manager.animation_status = status;
    }
    public get_animation_status():boolean {
        return this.animation_manager.get_animation_status
    }

}
