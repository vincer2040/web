use async_recursion::async_recursion;

type CmpFn<T> = fn(&T, &T) -> std::cmp::Ordering;

async fn partition<T>(arr: &mut [T], lo: isize, hi: isize, cmp_fn: CmpFn<T>, ws: &mut axum::extract::ws::WebSocket) -> isize
where
    T: Clone + serde::Serialize + Send + std::marker::Sync

{
    let mut idx: isize = lo - 1;
    let pivot = arr[hi as usize].clone();

    for i in lo..hi {
        let at = &arr[i as usize];
        let comparison = cmp_fn(&at, &pivot);
        match comparison {
            std::cmp::Ordering::Less => {
                idx += 1;
                let a = arr[i as usize].clone();
                arr[i as usize] = arr[idx as usize].clone();
                arr[idx as usize] = a;
                let arr_str = serde_json::to_string(arr).expect("arr to serialize");
                let _ = ws.send(axum::extract::ws::Message::Text(arr_str)).await;
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            std::cmp::Ordering::Equal => {
                idx += 1;
                let a = arr[i as usize].clone();
                arr[i as usize] = arr[idx as usize].clone();
                arr[idx as usize] = a;
                let arr_str = serde_json::to_string(arr).expect("arr to serialize");
                let _ = ws.send(axum::extract::ws::Message::Text(arr_str)).await;
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            std::cmp::Ordering::Greater => {}
        }
    }
    idx += 1;

    arr[hi as usize] = arr[idx as usize].clone();
    arr[idx as usize] = pivot;
    std::thread::sleep(std::time::Duration::from_millis(100));
    idx
}

#[async_recursion]
async fn qs<T>(arr: &mut [T], lo: isize, hi: isize, cmp_fn: CmpFn<T>, ws: &mut axum::extract::ws::WebSocket)
where
    T: Clone + serde::Serialize + Send + std::marker::Sync
{
    let pivot: isize;
    if lo >= hi {
        return;
    }

    pivot = partition(arr, lo, hi, cmp_fn, ws).await;
    qs(arr, lo, pivot - 1, cmp_fn, ws).await;
    qs(arr, pivot + 1, hi, cmp_fn, ws).await;
}

pub async fn quick_sort<T>(arr: &mut [T], cmp_fn: CmpFn<T>, ws: &mut axum::extract::ws::WebSocket)
where
    T: Clone + serde::Serialize + Send + std::marker::Sync

{
    let _ = qs(arr, 0, (arr.len() - 1) as isize, cmp_fn, ws).await;
}
