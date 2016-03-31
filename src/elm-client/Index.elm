module Index where

import Html exposing (..)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Effects exposing (Effects, none)
import TransitRouter
import RouteParser exposing (..)
import BlogHeader


-- MODEL

type alias Model = TransitRouter.WithRoute Route
  { loggedIn : String }

initialModel : Model
initialModel =
  { transitRouter = TransitRouter.empty Home
  , loggedIn = "Anonymous"
  }

init : String -> (Model, Effects Action)
init path =
  TransitRouter.init routerConfig path initialModel

type Route = Home | NotFound

-- UPDATE

type Action =
  NoOp
  | RouterAction (TransitRouter.Action Route)

routeParsers : List (Matcher Route)
routeParsers =
  [ static Home "/"
  ]

mountRoute : Route -> Route -> Model -> (Model, Effects Action)
mountRoute prevRoute route model =
  case route of

    -- in a typical SPA, you might have to trigger tasks when landing on a page,
    -- like an HTTP request to load specific data

    Home ->
      (model, Effects.none)

    NotFound ->
      (model, Effects.none)

decode : String -> Route
decode path =
  RouteParser.match routeParsers path
    |> Maybe.withDefault NotFound

routerConfig : TransitRouter.Config Route Action Model
routerConfig =
  { mountRoute = mountRoute
  , getDurations = \_ _ _ -> (50, 200)
  , actionWrapper = RouterAction
  , routeDecoder = decode
  }
-- routerConfig :
--   { mountRoute : Route -> Route -> Model -> (Model, Effects Action)
--   , getDurations : Route -> Route -> Model -> (Float, Float)
--   , actionWrapper : TransitRouter.Action -> Action
--   , routeDecoder : String -> Route
--   }

actions : Signal Action
actions =
  -- use mergeMany if you have other mailboxes or signals to feed into StartApp
  Signal.map RouterAction TransitRouter.actions

update : Action -> Model -> (Model, Effects Action)
update action model =
  case action of

    NoOp ->
      (model, Effects.none)

    RouterAction routeAction ->
      TransitRouter.update routerConfig routeAction model

-- VIEW

view : Signal.Address Action -> Model -> Html
view adress model =
    div []
      [ BlogHeader.view
      ]
