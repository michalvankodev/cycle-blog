import StartApp.Simple exposing (start)
import Index exposing (view, model, update)

main =
  start
    { model = model
    , view = view
    , update = update
    }
