import { platform } from "@tauri-apps/plugin-os";
import { AutoAnimateManager } from "./animation";

export class AppManager {

    public animation_manager: AutoAnimateManager;
    public platform:string;
    public theme : string;

    constructor({  animation_status,theme }: {  animation_status?: boolean,theme?:string }) {
        this.animation_manager = AutoAnimateManager.get_instance(animation_status || false);
        this.theme = theme||"dark";
        this.platform = platform();
    }
    
    public set_animation_status(status:boolean) {
        this.animation_manager.animation_status = status;
    }
    public get_animation_status():boolean {
        return this.animation_manager.get_animation_status
    }
    public is_phone():boolean{
        return this.platform === 'ios' || this.platform === 'android'
    }

}
