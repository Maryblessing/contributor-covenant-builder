/**
 * Copies text to clipboard.
 * Uses async browser Clipboard API.
 * adapted from Dean Taylor, via StackOverflow
 * @see https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 *
 * @param {string} text
 */
const copyToClipboard = (text = ``) => {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copied to clipboard!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}

// cr is just a shortform for document.createElement
const cr = (...args) => document.createElement(...args)

/**
 * buildHTML instantiates HTML nodes from a string.
 * @param {string} htmlString Any valid html.
 * @returns {Object[]} proper HTML nodes.
 */
const buildHTML = (htmlString) => {
  const template = cr('template')
  template.innerHTML = htmlString
  return template.content.cloneNode(true)
}

/**
 * revealStep toggles visibility for the specified step element.
 * @param {string} elemId ID of the container to make visible.
 */
const revealStep = (elemId) => {
  const steps = document.querySelectorAll('.step');
  const elem = document.getElementById(elemId);
  steps.forEach((step, i) => {
    step.classList.add('hidden');
  });
  elem.classList.remove('hidden');
}
