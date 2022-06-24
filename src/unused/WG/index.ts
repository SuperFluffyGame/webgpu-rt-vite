interface RendererConfig {}
type BufferData = BufferSource | SharedArrayBuffer;

export class Renderer {
    config: RendererConfig = {};
    private bindGroups: BufferBinding[][] = [[]];

    private constructor(
        private readonly gpu: GPU,
        private readonly adapter: GPUAdapter,
        private readonly device: GPUDevice,
        private readonly canvas: HTMLCanvasElement,
        private readonly vertexShader: string,
        private readonly fragmentShader: string,
        private readonly context: GPUCanvasContext
    ) {}
    static async init(
        gpu: GPU,
        canvas: HTMLCanvasElement,
        vertexShader: string,
        fragmentShader: string
    ) {
        const adapter = await gpu.requestAdapter();
        if (adapter === null) throw "Unable to create Adapter.";
        const device = await adapter.requestDevice();
        const context = canvas.getContext("webgpu");
        if (context === null) throw "Unable to get Context.";

        const wg = new Renderer(
            gpu,
            adapter,
            device,
            canvas,
            vertexShader,
            fragmentShader,
            context
        );

        return wg;
    }

    addBufferBinding(
        group: number,
        slot: number,
        size: number,
        visibility: number,
        usage: GPUBufferUsageFlags = GPUBufferUsage.UNIFORM |
            GPUBufferUsage.COPY_DST
    ) {
        if (!this.bindGroups[group]) {
            this.bindGroups[group] = [];
        }
        const binding = new BufferBinding(
            this.device,
            slot,
            size,
            visibility,
            usage
        );

        this.bindGroups[group][slot] = binding;
    }

    setBufferBinding(
        group: number,
        slot: number,
        data: BufferData,
        bufferOffset: number = 0
    ) {
        if (!this.bindGroups[group]?.[slot]) {
            throw `Binding at group ${group}, slot ${slot} doesn't exist.`;
        }

        this.bindGroups[group][slot].writeData(data, bufferOffset);
    }
    private genetateBindLayouts(): GPUBindGroupLayout[] {
        const out = [] as GPUBindGroupLayout[];
        for (const group of this.bindGroups) {
            const g = {} as GPUBindGroupLayoutDescriptor;
            for (const binding of group) {
                g.entries = [
                    {
                        binding: binding.slot,
                        visibility: binding.visibility,
                    },
                ];
            }
        }

        return out;
    }

    private generatePipeline(): GPURenderPipeline {
        return {};
    }
}

class BufferBinding {
    public readonly buffer: GPUBuffer;
    constructor(
        public readonly device: GPUDevice,
        public readonly slot: number,
        public readonly size: number,
        public readonly visibility: number,
        public readonly usage: GPUBufferUsageFlags
    ) {
        this.buffer = device.createBuffer({
            size,
            usage,
        });
    }

    writeData(
        data: BufferData,
        bufferOffset = 0,
        dataOffset = 0,
        size = data.byteLength
    ) {
        this.device.queue.writeBuffer(
            this.buffer,
            bufferOffset,
            data,
            dataOffset,
            size
        );
    }
}
