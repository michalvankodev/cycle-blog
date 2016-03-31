module NotFound where

import Html exposing (..)


view : Html
view =
  section []
    [ h2 [] [text "I am sorry"]
    , p [] [text "I was not able to found content four you. 404"]
    ]
