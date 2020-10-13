import { SelectorOrNodes, Freeze, FreezeframeOptions, RequireProps } from '../types';
declare class Freezeframe {
    #private;
    options: FreezeframeOptions;
    items: Freeze[];
    $images: HTMLImageElement[];
    private _eventListeners;
    private get _stylesInjected();
    constructor(target?: SelectorOrNodes | RequireProps<FreezeframeOptions, 'selector'>, options?: FreezeframeOptions);
    private _init;
    private _capture;
    private _load;
    private _setup;
    private _wrap;
    private _process;
    private _ready;
    private _attach;
    private _addEventListener;
    private _removeEventListener;
    private _injectStylesheet;
    private _emit;
    private _toggleOn;
    private _toggleOff;
    private _toggle;
    start(): this;
    stop(): this;
    toggle(): this;
    on(event: string, cb: Function): this;
    destroy(): void;
}
export default Freezeframe;