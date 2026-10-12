
# Typography

Kinetic typography and text animation patterns.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| CSS Text | developer.mozilla.org/CSS/text |
| GSAP SplitText | gsap.com/docs/v3/Plugins/SplitText |

## Quick Reference

Load from: `tokens/typography.tokens.json`

### Stagger Delays

| Token | Value | Use |
|-------|-------|-----|
| `character-stagger.fast` | 20ms | Rapid characters |
| `character-stagger.normal` | 50ms | Standard reveal |
| `word-stagger.normal` | 150ms | Word by word |
| `line-stagger.normal` | 200ms | Line by line |

### Typewriter

| Token | Value | Use |
|-------|-------|-----|
| `speed.normal` | 80ms | Natural typing |
| `cursor-blink` | 530ms | Cursor blink rate |
| `pause-period` | 500ms | End of sentence |

## Selection Guide

```
What text effect?
│
├── REVEAL → Text appears
│   ├── Fade up → opacity + translateY
│   ├── Slide in → from direction
│   ├── Scale → grow from small
│   └── Clip → mask reveal
│
├── TYPEWRITER → Character by character
│   ├── Standard → fixed speed
│   ├── Natural → variable speed
│   └── With cursor → blinking cursor
│
├── SCRAMBLE → Decode effect
│   ├── Random chars → chaotic
│   ├── Sequential → left to right
│   └── All at once → simultaneous
│
├── WAVE → Continuous motion
│   ├── Vertical → bounce effect
│   ├── Horizontal → sway effect
│   └── Rotation → twist effect
│
├── COUNTER → Number animation
│   ├── Count up → 0 to target
│   ├── Count down → target to 0
│   └── Slot machine → rolling digits
│
└── SPECIAL → Creative effects
    ├── Gradient → animated colors
    ├── Glitch → distortion
    └── Highlight → underline/bg reveal
```

## Patterns

### Split Text Reveal

Character-by-character fade up.

**CSS + JavaScript:**
```javascript
function splitText(element, mode = 'chars') {
  const text = element.textContent;
  element.innerHTML = '';

  const items = mode === 'chars' ? text.split('') :
                mode === 'words' ? text.split(' ') :
                text.split('\n');

  items.forEach((item, i) => {
    const span = document.createElement('span');
    span.textContent = item === ' ' ? '\u00A0' : item;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    element.appendChild(span);

    if (mode === 'words' && i < items.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  return element.querySelectorAll('span');
}

function revealText(element, stagger = 50) {
  const spans = splitText(element, 'chars');
  // {motion.typography.character-stagger.normal}

  spans.forEach((span, i) => {
    span.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 500, // {motion.typography.reveal-duration.normal}
      delay: i * stagger,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    });
  });
}
```

**GSAP + SplitText:**
```javascript
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

function revealHeadline(element) {
  const split = new SplitText(element, { type: 'chars, words' });

  gsap.from(split.chars, {
    opacity: 0,
    y: 20,
    duration: 0.5,  // {motion.typography.reveal-duration.normal}
    stagger: 0.05,  // {motion.typography.character-stagger.normal}
    ease: 'power2.out'
  });
}
```

**Framer Motion:**
```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05 // {motion.typography.character-stagger.normal}
    }
  }
};

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const AnimatedText = ({ text }) => (
  <motion.div variants={container} initial="hidden" animate="visible">
    {text.split('').map((char, i) => (
      <motion.span key={i} variants={child} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </motion.div>
);
```

### Typewriter Effect

Progressive text reveal with cursor.

**JavaScript:**
```javascript
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 80;       // {motion.typography.typewriter.speed.normal}
    this.pauseComma = options.pauseComma || 200;   // {motion.typography.typewriter.pause-comma}
    this.pausePeriod = options.pausePeriod || 500; // {motion.typography.typewriter.pause-period}
    this.showCursor = options.cursor !== false;
    this.cursorBlink = options.cursorBlink || 530; // {motion.typography.typewriter.cursor-blink}
  }

  async type(text) {
    this.element.textContent = '';

    if (this.showCursor) {
      this.cursor = document.createElement('span');
      this.cursor.textContent = '|';
      this.cursor.style.animation = `blink ${this.cursorBlink}ms step-end infinite`;
      this.element.appendChild(this.cursor);
    }

    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      this.element.insertBefore(span, this.cursor);

      let delay = this.speed;

      // Natural pauses
      if (char === ',') delay += this.pauseComma;
      if (char === '.' || char === '!' || char === '?') delay += this.pausePeriod;

      await this.wait(delay);
    }
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CSS for cursor
// @keyframes blink { 50% { opacity: 0; } }
```

### Text Scramble/Decode

Glitchy reveal effect.

**JavaScript:**
```javascript
class TextScramble {
  constructor(element, options = {}) {
    this.element = element;
    this.chars = options.chars || '!<>-_\\/[]{}—=+*^?#________';
    this.iterations = options.iterations || 8; // {motion.typography.scramble.iterations.normal}
    this.speed = options.speed || 60;          // {motion.typography.scramble.speed.normal}
  }

  async scrambleTo(text) {
    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, text.length);
    const chars = [];

    // Initialize with old text or random
    for (let i = 0; i < length; i++) {
      chars.push({
        current: oldText[i] || '',
        target: text[i] || '',
        iterations: 0
      });
    }

    return new Promise(resolve => {
      const update = () => {
        let complete = true;

        this.element.textContent = chars.map((char, i) => {
          if (char.current === char.target) return char.current;

          complete = false;
          char.iterations++;

          if (char.iterations >= this.iterations) {
            char.current = char.target;
            return char.current;
          }

          return this.randomChar();
        }).join('');

        if (!complete) {
          setTimeout(update, this.speed);
        } else {
          resolve();
        }
      };

      update();
    });
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
```

### Wave Text Animation

Continuous bouncing letters.

**CSS:**
```css
.wave-text span {
  display: inline-block;
  animation: wave 1s ease-in-out infinite;
  /* {motion.typography.wave.frequency.normal} */
}

.wave-text span:nth-child(1) { animation-delay: 0s; }
.wave-text span:nth-child(2) { animation-delay: 0.1s; }
.wave-text span:nth-child(3) { animation-delay: 0.2s; }
/* ... continue for each character */

@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  /* {motion.typography.wave.amplitude.normal} */
}
```

**JavaScript:**
```javascript
function waveText(element, options = {}) {
  const amplitude = options.amplitude || 10;  // {motion.typography.wave.amplitude.normal}
  const frequency = options.frequency || 1000; // {motion.typography.wave.frequency.normal}
  const offset = options.offset || 0.2;        // {motion.typography.wave.offset.normal}

  const spans = element.querySelectorAll('span');

  function animate(time) {
    spans.forEach((span, i) => {
      const phase = (time / frequency + i * offset) * Math.PI * 2;
      const y = Math.sin(phase) * amplitude;
      span.style.transform = `translateY(${y}px)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
```

### Number Counter

Animated counting effect.

**JavaScript:**
```javascript
function animateCounter(element, target, options = {}) {
  const duration = options.duration || 1500;  // {motion.typography.counter.duration.normal}
  const start = options.start || 0;
  const decimals = options.decimals || 0;
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';

  const startTime = performance.now();

  // Custom easing: fast start, slow end
  // {motion.typography.counter.easing}
  function ease(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = ease(progress);

    const current = start + (target - start) * eased;
    element.textContent = prefix + current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Slot machine style
function slotMachineCounter(element, target) {
  const digits = target.toString().split('');
  element.innerHTML = '';

  digits.forEach((digit, i) => {
    const slot = document.createElement('span');
    slot.className = 'slot';
    slot.style.display = 'inline-block';
    slot.style.overflow = 'hidden';
    slot.style.height = '1em';

    const inner = document.createElement('span');
    inner.style.display = 'block';

    // Add numbers 0-9 then final digit
    for (let n = 0; n <= 9; n++) {
      inner.textContent += n + '\n';
    }

    slot.appendChild(inner);
    element.appendChild(slot);

    // Animate to final position
    inner.animate([
      { transform: 'translateY(0)' },
      { transform: `translateY(-${parseInt(digit) * 1}em)` }
    ], {
      duration: 1500 + i * 200,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
  });
}
```

### Gradient Text Animation

Animated color gradient.

**CSS:**
```css
.gradient-text {
  background: linear-gradient(
    90deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #764ba2 75%,
    #667eea 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradient-shift 3s linear infinite;
  /* {motion.typography.gradient-animation.speed.normal} */
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

### Text Highlight Animation

Underline or background reveal.

**CSS:**
```css
.highlight-text {
  position: relative;
  display: inline;
}

.highlight-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 4px; /* {motion.typography.highlight.thickness.normal} */
  background: currentColor;
  transition: width 400ms ease-out;
  /* {motion.typography.highlight.duration.normal} */
}

.highlight-text.active::after {
  width: 100%;
}

/* Background highlight */
.bg-highlight {
  background: linear-gradient(to right, #fef08a 50%, transparent 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: background-position 400ms ease-out;
}

.bg-highlight.active {
  background-position: 0 0;
}
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Character stagger | Instant or fade only |
| Typewriter | Instant appear |
| Wave animation | Static text |
| Scramble | Instant swap |
| Counter | Instant final value |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .wave-text span {
    animation: none;
  }

  .gradient-text {
    animation: none;
  }
}
```

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Show final text immediately
  element.textContent = targetText;
} else {
  typewriter.type(targetText);
}
```

## Cross-References

- See `sequencing/` for stagger timing patterns
- See `reveals/` for text reveal masks
- See `opacity/` for fade effects
- See `distortion/` for glitch effects

## References

- `references/kinetic-typography.md` — Advanced text animation techniques
