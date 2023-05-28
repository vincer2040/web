import { createSignal } from "solid-js";

const Counter = () => {
    const [count, setCount] = createSignal<number>(0);
    return(
        <button class="grid place-items-center px-4 py-2 bg-blue-600 text-neutral-100 rounded-md" onClick={
            () => {
                setCount(count() + 1);
            }
        }>clicked {count()} times </button>
    )
}

export default Counter;
