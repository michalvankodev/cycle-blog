module BlogHeader where

import Html exposing (..)
import Html.Attributes exposing (style)
import ParseInt exposing (toRadix')
import String

-- VIEW

view : Html
view =
  header []
    [ h1 [] [text "Michal's Blog"]
    , span [] [text fourTwenty]
    ]

fourTwenty : String
fourTwenty = String.pad 32 '0' (toRadix' 2 420)
