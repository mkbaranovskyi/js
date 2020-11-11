# HTMLMediaElement

## Properties

Property|Description
-|-
`autoplay`|Boolean. Note that browsers can block autoplay until some actions from a user are taken.
`constols`|Boolean. Interface controls.
`controlsList`|Indicates specific controls settings, e.g. 'no-download', 'no-fullscreen', etc.
`crossOrigin`|CORS settings.
`currentTime`|Playback position is s.
`duration`|Total duration in s.
`ended`|Boolean.
`loop`|Boolean.
`muted`|Boolean.
`paused`|Boolean.
`readyState`|Number indicating the readiness state.
`src`|URL of a media.
`volume`|From 0.0 to 1.1.

## Methods

Method|Description
-|-
`play()`|Begins playback.
`pause()`|Pauses playback.

## Events

Event|Description
-|-
`ended`|Fired when playback stops when end of the media is reached or no more data available.
`error`|Fired when the resource could not be loaded due to an error.
`play`|When playback starts.
`pause`|When playback is paused.
***


## Audio

Inherits props and methods from HTMLMediaElement. 

```javascript
const song = new Audio('audio.mp3')	// HTMLAudioElement

// or
song.url = 'ringtone.mp3'
```

Audio elements can also be created using `document.createElement('audio')` resulting in the same object.

Browsers usually block autoplay when the page is loaded, try pressing keys at least.
***


## Video

Inherits props and methods from HTMLMediaElement.

`poster` prop reflects the HTML `poster` attribute.
***


## Determining when playback can begin

There are three ways you can tell when enough of the audio file has loaded to allow playback to begin:

1. Check the value of the `readyState` property:
   - `HAVE_FUTURE_DATA` -> you have enough data for **at least a short** playback.
   - `HAVE_ENOUGH_DATA` -> you have enough data for a **long** playback.

2. Listen for specific events:
   -  `canplay` -> `HAVE_FUTURE_DATA`
   -  `canplaythrough` -> `HAVE_ENOUGH_DATA`

```javascript
song.addEventListener('canplaythrough', () => {
   console.log('Can play through')
   song.play()    // autoplay might not work without the user action
})
```
***

