let sounds = [],
  loopButtons = [],
  loopIntervals = [],
  randomPitchButtons = [],
  octaveButtons = [],
  octaveShift = [],
  delayCheckboxes = [],
  delayEffects = [],
  tremoloIntervals = [],
  scaleSelector,
  tremoloSelector,
  tremoloCheckbox,
  tempoSlider,
  syncButton,
  reverbEffect,
  reverbButton,
  osc,
  oscLoopButton,
  oscLoopInterval,
  oscRandomPitchButton,
  oscDelayCheckbox,
  oscDelayEffect,
  oscOctaveShift = 0,
  sampleVolumeSlider,
  oscVolumeSlider,
  autoTempoCheckbox,
  autoTempoInterval,
  minTempo = 100,
  maxTempo = 1000,
  autoPanCheckbox,
  autoPanInterval,
  sampleSelector,
  selectedSampleFileName;

let scales = {
  Major: [0, 2, 4, 5, 7, 9, 11, 12],
  Minor: [0, 2, 3, 5, 7, 8, 10, 12],
  "Whole Tone": [0, 2, 4, 6, 8, 10, 12],
  Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  Heptatonic: [0, 2, 4, 5, 7, 9, 10],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11, 12],
  "Major Pentatonic": [0, 2, 4, 7, 9],
  "Balinese Pelog": [0, 1, 3, 7, 8],
  "Javanese Pelog": [0, 1, 3, 7, 8],
  Slendro: [0, 1, 5, 7, 10],
  Klezmer: [0, 2, 3, 6, 7, 8, 11, 12],
  "Persian Dastgāh-e Shūr": [0, 1, 4, 5, 6, 8, 10, 11, 12],
  "Raag Bhairavi": [0, 1, 3, 5, 7, 8, 10],
  "Chinese Pentatonic (宫)": [0, 2, 4, 7, 9, 12],
  Hirajoshi: [0, 2, 3, 7, 8],
  "Maqam Bayati": [0, 1, 3, 5, 7, 8, 10],
  Enigmatic: [0, 1, 4, 6, 8, 10, 11],
  "Phrygian Dominant": [0, 1, 4, 5, 7, 8, 10, 12],
  "African Kumoi": [0, 2, 3, 7, 9],
  "Vietnamese Traditional": [0, 3, 5, 6, 7, 10],
  "Hawaiian Slack Key": [0, 2, 3, 5, 7, 10, 12],
};

function preload() {
  loadSelectedSample("RullyShabaraSampleV02.mp3");
}

function setup() {
  createCanvas(500, 400);
  background(5, 165, 200);
  sampleSelector = createSelect();
  sampleSelector.position(275, 10);
  sampleSelector.option("Basic", "RullyShabaraSampleV02.mp3");
  sampleSelector.option("Dissonant", "RullyShabaraSampleF03.mp3");
  sampleSelector.selected("Basic");
  sampleSelector.changed(switchSample);
  scaleSelector = createSelect();
  scaleSelector.position(50, 10);
  scaleSelector.style("background-color", "#607D8B");
  scaleSelector.style("color", "#CED6DA");
  scaleSelector.style("padding", "2px 10px");
  scaleSelector.style("margin", "11px 0");
  scaleSelector.style("font-size", "1em");
  scaleSelector.style("border-radius", "8px");
  scaleSelector.style("font-family", "Roboto, sans-serif");

  for (let scale in scales) {
    scaleSelector.option(scale);
  }

  for (let i = 0; i < sounds.length; i++) {
    let loopButton = createButton("Auto " + (i + 1));
    loopButton.position(50, 100 + i * 38);
    loopButton.mousePressed(() => toggleLoop(i));
    loopButtons.push(loopButton);

    let randomPitchButton = createButton("Note " + (i + 1));
    randomPitchButton.position(170, 100 + i * 38);
    randomPitchButton.mousePressed(() => playRandomPitch(i));
    randomPitchButtons.push(randomPitchButton);

    let octaveButton = createButton("Octave " + (i + 1));
    octaveButton.position(290, 100 + i * 38);
    octaveButton.mousePressed(() => changeOctave(i));
    octaveButtons.push(octaveButton);

    let delayCheckbox = createCheckbox("Delay " + (i + 1), false);
    delayCheckbox.position(400, 110 + i * 40);
    delayCheckbox.changed(() => toggleDelay(i));
    delayCheckboxes.push(delayCheckbox);

    let delay = new p5.Delay();
    delayEffects.push(delay);

    autoPanCheckbox = createCheckbox("Auto Pan", false);
    autoPanCheckbox.position(290, 290);
    autoPanCheckbox.changed(toggleAutoPan);

    octaveShift[i] = 0;

    reverbEffect = new p5.Reverb();
    reverbCheckbox = createCheckbox("Reverb", false);
    reverbCheckbox.position(170, 290);
    reverbCheckbox.changed(toggleReverb);
  }

  oscLoopButton = createButton("Auto 0");
  oscLoopButton.position(50, 230);
  oscLoopButton.mousePressed(toggleOscLoop);

  oscRandomPitchButton = createButton("Note 0");
  oscRandomPitchButton.position(170, 230);
  oscRandomPitchButton.mousePressed(() => playRandomOscillatorPitch());

  oscDelayCheckbox = createCheckbox("Delay 0", false);
  oscDelayCheckbox.position(400, 245);
  oscDelayCheckbox.changed(toggleOscDelay);

  oscDelayEffect = new p5.Delay();

  oscOctaveButton = createButton("Octave 0");
  oscOctaveButton.position(290, 230);
  oscOctaveButton.mousePressed(changeOscOctave);

  autoTempoCheckbox = createCheckbox("Xhabarabot Mode", false);
  autoTempoCheckbox.position(50, 65);
  autoTempoCheckbox.changed(toggleAutoTempo);

  tremoloSelector = createSelect();
  tremoloSelector.position(50, 350);
  for (let i = 1; i <= 10; i++) {
    tremoloSelector.option(i);
  }
  tremoloSelector.selected(1);

  tremoloCheckbox = createCheckbox("Tremolo", false);
  tremoloCheckbox.position(112, 367);
  tremoloCheckbox.changed(toggleTremolo);

  tempoSlider = createSlider(0, 1000, 50, 100);
  textSize(13);
  text("Tempo", 372, 69);
  fill(500, 500, 353);
  tempoSlider.position(225, 55);

  textSize(10);
  text("XHABARABOT SCALEX 1.0", 360, 387);
  fill(200, 500, 53);

  syncCheckbox = createCheckbox("Sync", false);
  syncCheckbox.position(50, 290);
  syncCheckbox.changed(syncLoops);

  osc = new p5.Oscillator();
  osc.setType("sine");
  osc.freq(440);
  osc.amp(0.3);

  sampleVolumeSlider = createSlider(0, 2, 1, 0.01); // range from 0 (silent) to 1 (full volume), initial value 0.5, step size 0.01
  sampleVolumeSlider.position(50, 310);
  sampleVolumeSlider.input(() => {
    for (let sound of sounds) {
      sound.setVolume(sampleVolumeSlider.value());
    }
  });

  oscVolumeSlider = createSlider(0, 1, 0.2, 0.01); // range from 0 (silent) to 1 (full volume), initial value 0.5, step size 0.01
  oscVolumeSlider.position(230, 310);
  oscVolumeSlider.input(() => {
    osc.amp(oscVolumeSlider.value());
  });
}

function toggleAutoTempo() {
  if (autoTempoInterval) {
    clearInterval(autoTempoInterval);
    autoTempoInterval = null;
    for (let i = 0; i < loopIntervals.length; i++) {
      clearInterval(loopIntervals[i]);
      loopIntervals[i] = setInterval(
        () => playRandomPitch(i),
        tempoSlider.value()
      );
    }
    if (oscLoopInterval) {
      clearInterval(oscLoopInterval);
      oscLoopInterval = setInterval(
        () => playRandomOscillatorPitch(),
        tempoSlider.value()
      );
    }
  } else {
    autoTempoInterval = setInterval(() => {
      let newTempo =
        Math.floor(Math.random() * (maxTempo - minTempo + 1)) + minTempo;
      tempoSlider.value(newTempo);
      for (let i = 0; i < loopIntervals.length; i++) {
        clearInterval(loopIntervals[i]);
        loopIntervals[i] = setInterval(() => playRandomPitch(i), newTempo);
      }
      if (oscLoopInterval) {
        clearInterval(oscLoopInterval);
        oscLoopInterval = setInterval(
          () => playRandomOscillatorPitch(),
          newTempo
        );
      }
    }, 20000);
  }
}

function toggleAutoPan() {
  if (autoPanInterval) {
    clearInterval(autoPanInterval);
    autoPanInterval = null;
    for (let sound of sounds) {
      sound.pan(0); // Reset pan when auto-pan is turned off
    }
  } else {
    autoPanInterval = setInterval(() => {
      let panAmount = sin(frameCount * 2);
      for (let sound of sounds) {
        sound.pan(panAmount);
      }
    }, 50);
  }
}

function playRandomPitch(index) {
  let sound = sounds[index];
  let scale = scales[scaleSelector.value()];

  sound.stop();

  let randomPitch = scale[Math.floor(Math.random() * scale.length)];

  let octaveAdjustment;
  if (octaveShift[index] === 1) {
    octaveAdjustment = -12; // one octave down
  } else if (octaveShift[index] === 2) {
    octaveAdjustment = -24; // two octaves down
  } else if (octaveShift[index] === 3) {
    octaveAdjustment = 12; // one octave up
  } else if (octaveShift[index] === 4) {
    octaveAdjustment = 24; // two octaves up
  } else {
    octaveAdjustment = 0; // no change
  }

  sound.rate(pow(2, (randomPitch + octaveAdjustment) / 12));
  sound.play();
}

function loadSelectedSample(sampleFileName) {
  sounds = [];
  for (let i = 0; i < 3; i++) {
    let sound = loadSound(sampleFileName);
    sounds.push(sound);
  }
}

function switchSample() {
  let selectedSampleFileName = sampleSelector.value();
  loadSelectedSample(selectedSampleFileName);
}

function changeOctave(index) {
  octaveShift[index] = (octaveShift[index] + 1) % 5; // Cycle through 0, 1, 2, 3, 4 (representing octave shift of 0, -1, -2, +1, +2)
  let sign =
    octaveShift[index] === 1
      ? "-"
      : octaveShift[index] === 2
      ? "--"
      : octaveShift[index] === 3
      ? "+"
      : octaveShift[index] === 4
      ? "++"
      : "";
  octaveButtons[index].html("Octave " + sign + " " + (index + 1));
}

function toggleLoop(index) {
  if (loopIntervals[index]) {
    clearInterval(loopIntervals[index]);
    loopIntervals[index] = null;
    loopButtons[index].html("Auto " + (index + 1));
  } else {
    playRandomPitch(index);
    if (loopIntervals[index]) {
      clearInterval(loopIntervals[index]);
    }
    loopIntervals[index] = setInterval(
      () => playRandomPitch(index),
      tempoSlider.value()
    );
    loopButtons[index].html("Stop" + (index + 1));
  }
}

function toggleDelay(index) {
  let delay = delayEffects[index];
  delay.process(sounds[index], 0.12, 0.7, 2300);
  if (delayCheckboxes[index].checked()) {
    delay.connect();
  } else {
    delay.disconnect();
  }
}

function toggleTremolo() {
  if (tremoloCheckbox.checked()) {
    let tremoloPeriod = 1000 / tremoloSelector.value();
    for (let i = 0; i < sounds.length; i++) {
      let sound = sounds[i];
      tremoloIntervals[i] = setInterval(() => {
        if (sound.isPlaying()) {
          sound.stop();
        } else {
          sound.play();
        }
      }, tremoloPeriod);
    }
  } else {
    for (let i = 0; i < tremoloIntervals.length; i++) {
      clearInterval(tremoloIntervals[i]);
      tremoloIntervals[i] = null;
    }
  }
}

function syncLoops() {
  if (syncCheckbox.checked()) {
    // Stop all currently running loops
    for (let i = 0; i < loopIntervals.length; i++) {
      clearInterval(loopIntervals[i]);
      loopIntervals[i] = null;
      loopButtons[i].html("Auto" + (i + 1));
    }
    // Restart all loops at the same time
    for (let i = 0; i < sounds.length; i++) {
      playRandomPitch(i);
      loopIntervals[i] = setInterval(
        () => playRandomPitch(i),
        tempoSlider.value()
      );
      loopButtons[i].html("Stop " + (i + 1));
    }
    if (osc.started) {
      playRandomOscillatorPitch();
      oscLoopInterval = setInterval(
        () => playRandomOscillatorPitch(),
        tempoSlider.value()
      );
      oscLoopButton.html("Stop 0");
    }
  } else {
    // Code to handle unchecking the sync checkbox, if needed
  }
}

function toggleReverb() {
  if (reverbCheckbox.checked()) {
    for (let sound of sounds) {
      reverbEffect.process(sound, 10, 10);
    }
  } else {
    reverbEffect.disconnect();
  }
}

function toggleOscLoop() {
  if (oscLoopInterval) {
    clearInterval(oscLoopInterval);
    oscLoopInterval = null;
    osc.stop();
    oscLoopButton.html("Auto 0");
  } else {
    if (!osc.started) {
      osc.start();
    }
    playRandomOscillatorPitch();
    if (oscLoopInterval) {
      clearInterval(oscLoopInterval);
    }
    oscLoopInterval = setInterval(
      () => playRandomOscillatorPitch(),
      tempoSlider.value()
    );
    oscLoopButton.html("Stop 0");
  }
}

function changeOscOctave() {
  oscOctaveShift = (oscOctaveShift + 1) % 5;
  let sign =
    oscOctaveShift === 1
      ? "-"
      : oscOctaveShift === 2
      ? "--"
      : oscOctaveShift === 3
      ? "+"
      : oscOctaveShift === 4
      ? "++"
      : "";
  oscOctaveButton.html("Octave " + sign);
}

function playRandomOscillatorPitch() {
  let scale = scales[scaleSelector.value()];
  let randomPitch = scale[Math.floor(Math.random() * scale.length)];

  let octaveAdjustment =
    oscOctaveShift === 1
      ? -12
      : oscOctaveShift === 2
      ? -24
      : oscOctaveShift === 3
      ? 12
      : oscOctaveShift === 4
      ? 24
      : 0;

  osc.freq(midiToFreq(60 + randomPitch + octaveAdjustment));
}

function toggleOscDelay() {
  oscDelayEffect.process(osc, 0.12, 0.7, 2300);
  if (oscDelayCheckbox.checked()) {
    oscDelayEffect.connect();
  } else {
    oscDelayEffect.disconnect();
  }
}

function toggleOscillator() {
  if (!osc.started) {
    osc.start();
    oscButton.html("Stop 0");
  } else {
    osc.stop();
    oscButton.html("Oscillator");
  }
}
