open Tyxml
open Html

type todo =
  { id : int
  ; name : string
  ; complete : bool
  }

let global_id = ref 0
let global_todos = ref []
let mytitle = title (txt "todo app")
let htmx = script ~a:[ a_src "https://unpkg.com/htmx.org@1.9.4" ] (txt "")
let elt_to_string el = Fmt.str "%a" (Tyxml.Html.pp_elt ()) el
let push_todo todo = global_todos := todo :: !global_todos
let header = header [ h1 [ txt "Todo App" ] ]

let mark_complete id =
  let todo = List.find (fun a -> a.id == id) !global_todos in
  let complete = { id; name = todo.name; complete = true } in
  global_todos := List.filter (fun a -> id != a.id) !global_todos;
  push_todo complete
;;

let todo_delete id =
  global_todos := List.filter (fun a -> id != a.id) !global_todos
;;

let todoform request =
  let make_input ~name ~text ~input_type =
    div
      [ label ~a:[ a_label_for name ] [ txt text ]
      ; input ~a:[ a_id name; a_name name; a_input_type input_type ] ()
      ]
  in
  let make_btn ~button_type ~text =
    div [ button ~a:[ a_button_type button_type ] [ txt text ] ]
  in
  div
    [ h2 [ txt "create todo" ]
    ; form
        ~a:
          [ Unsafe.string_attrib "hx-post" "/todo"
          ; Unsafe.string_attrib "hx-target" "#todos"
          ; Unsafe.string_attrib "hx-swap" "outerHTML"
          ]
        [ Dream.csrf_tag request |> Unsafe.data (* Dune's hidden element *)
        ; make_input ~name:"name" ~text:"name:" ~input_type:`Text
        ; make_btn ~button_type:`Submit ~text:"submit"
        ]
    ]
;;

let todo_create id name complete =
  let todo = { id; name; complete } in
  todo
;;

let html_from_todo todo =
  match todo.complete with
  | true ->
    li
      [ p [ txt @@ "id: " ^ string_of_int todo.id ]
      ; p [ txt @@ "name: " ^ todo.name ]
      ; div
          [ button
              ~a:
                [ Unsafe.string_attrib
                    "hx-delete"
                    ("/todo/" ^ string_of_int todo.id)
                ; Unsafe.string_attrib "hx-target" "#todos"
                ; Unsafe.string_attrib "hx-swap" "outerHTML"
                ]
              [ txt "delete" ]
          ]
      ]
  | false ->
    li
      [ p [ txt @@ "id: " ^ string_of_int todo.id ]
      ; p [ txt @@ "name: " ^ todo.name ]
      ; div
          [ button
              ~a:
                [ Unsafe.string_attrib
                    "hx-put"
                    ("/todo/" ^ string_of_int todo.id)
                ; Unsafe.string_attrib "hx-target" "#todos"
                ; Unsafe.string_attrib "hx-swap" "outerHTML"
                ]
              [ txt "mark complete" ]
          ]
      ]
;;

let compare_todo a b = compare a.id b.id

let html_from_todos () =
  let len = List.length !global_todos in
  match len with
  | 0 -> p [ txt "nothing to do" ]
  | _ ->
    let t =
      List.filter (fun a -> if a.complete then false else true) !global_todos
    in
    (match List.length t with
     | 0 -> p [ txt "nothing to do" ]
     | _ ->
       let x =
         List.sort compare_todo t |> List.map (fun a -> html_from_todo a) |> ul
       in
       div [ p [ txt "todo" ]; x ])
;;

let html_from_comlete () =
  let len = List.length !global_todos in
  match len with
  | 0 -> p [ txt "" ]
  | _ ->
    let t =
      List.filter (fun a -> a.complete) !global_todos |> List.sort compare_todo
    in
    (match List.length t with
     | 0 -> p [ txt "nothing complete" ]
     | _ ->
       let x = List.map (fun a -> html_from_todo a) t |> ul in
       div [ p [ txt "complete" ]; x ])
;;

let get_todos () =
  let todos = html_from_todos () in
  let complete = html_from_comlete () in
  div ~a:[ a_id "todos" ] [ todos; complete ]
;;

let template contents request =
  let form = todoform request in
  let content =
    html (head mytitle [ htmx ]) (body [ header; form; contents ])
  in
  elt_to_string content |> Dream.html
;;

let () =
  Dream.run ~port:6969
  @@ Dream.logger
  @@ Dream.memory_sessions
  @@ Dream.router
       [ (Dream.get "/"
          @@ fun request ->
          let conents = get_todos () in
          let html = template conents request in
          html)
       ; (Dream.post "/todo"
          @@ fun request ->
          match%lwt Dream.form request with
          | `Ok [ ("name", name) ] ->
            let id = !global_id in
            todo_create id name false |> push_todo;
            global_id := !global_id + 1;
            Dream.html @@ elt_to_string @@ get_todos ()
          | _ -> assert false)
       ; (Dream.put "/todo/:id"
          @@ fun request ->
          Dream.param request "id" |> int_of_string |> mark_complete;
          get_todos () |> elt_to_string |> Dream.html)
       ; (Dream.delete "/todo/:id"
          @@ fun request ->
          Dream.param request "id" |> int_of_string |> todo_delete;
          get_todos () |> elt_to_string |> Dream.html)
       ]
;;
