import { Index, createSignal } from "solid-js";
import { randomInt } from "../util/rand";
import { getWsURL } from "../util/url";

export default function QS() {
    let original: number[] = [];
    let i: number;
    for (i = 0; i < 50; ++i) {
        original.push(randomInt(100));
    }
    const [data, setData] = createSignal<number[]>(original);
    function sort() {
        const url = getWsURL("/qs");
        const socket = new WebSocket(url);
        socket.addEventListener("open", (_) => {
            socket.send(JSON.stringify(original));
        });
        socket.addEventListener("message", (e) => {
            const newData = JSON.parse(e.data);
            setData(newData);
        });
    }
    return (
        <div class="flex flex-col items-center justify-center">
            <div class="p-5">
                <button
                    onclick={sort}
                    class="bg-gray-200 text-xl px-5 py-2 border-2 border-black rounded-sm"
                    >sort
                </button>
            </div>
            <div class="h-60">
                <div class="flex h-full gap-2"
                    style={{transform: "scale(1, -1)"}}
                >
                    <Index each={data()} fallback={<div>Loading...</div>}>
                        {(item) => (
                            <div
                                style={{height: item() + "%"}}
                                class="bg-blue-300 w-3"
                                >
                            </div>
                        )}
                    </Index>
                </div>
            </div>
        </div>
    );
}
