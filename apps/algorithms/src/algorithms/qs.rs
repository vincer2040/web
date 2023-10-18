type CmpFn = fn(i32, i32) -> std::cmp::Ordering;

fn partition(arr: &mut [i32], lo: isize, hi: isize, cmp_fn: CmpFn) -> isize {
    let mut idx: isize = lo - 1;
    let pivot = arr[hi as usize];

    for i in lo..hi {
        let at = arr[i as usize];
        let comparison = cmp_fn(at, pivot);
        match comparison {
            std::cmp::Ordering::Less => {
                idx+=1;
                let a = arr[i as usize];
                arr[i as usize] = arr[idx as usize];
                arr[idx as usize] = a;
            }
            std::cmp::Ordering::Equal => {
                idx+=1;
                let a = arr[i as usize];
                arr[i as usize] = arr[idx as usize];
                arr[idx as usize] = a;
            }
            std::cmp::Ordering::Greater => {}
        }
    }
    idx+=1;

    arr[hi as usize] = arr[idx as usize];
    arr[idx as usize] = pivot;
    idx
}

fn rqs(arr: &mut [i32], lo: isize, hi: isize, cmp_fn: CmpFn) {
    let pivot: isize;
    if lo >= hi {
        return;
    }

    pivot = partition(arr, lo, hi, cmp_fn);
    rqs(arr, lo, pivot - 1, cmp_fn);
    rqs(arr, pivot + 1, hi, cmp_fn);
}

pub fn qs(arr: &mut [i32], cmp_fn: CmpFn) {
    rqs(arr, 0, (arr.len() - 1) as isize, cmp_fn);
}

#[cfg(test)]
mod test {
    use crate::algorithms::qs::qs;


    fn cmp(a: i32, b: i32) -> std::cmp::Ordering {
        let res = a.cmp(&b);
        println!("{} {} {:#?}", a, b, res);
        res
    }

    #[test]
    fn qs_test() {
        let mut data = [9, 3, 7, 4, 69, 420, 42, -1];

        qs(&mut data, cmp);

        assert_eq!(data, [-1, 3, 4, 7, 9, 42, 69, 420]);
    }
}
