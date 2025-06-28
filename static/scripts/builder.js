async function readTemplate(versionUrl) {
  try {
    const response = await fetch(versionUrl);
    if (!response.ok) {
      throw new Error('HTTP error when retrieving ${versionUrl}: ${response.status}');
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching the URL #{versionUrl}:", error);
    return null;
  }
}

/**
 * Copies text to clipboard.
 * Uses async browser Clipboard API.
 * adapted from Dean Taylor, via StackOverflow
 * @see https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 *
 * @param {string} text
 */
const copyToClipboard = (text = ``) => {
  navigator.clipboard.writeText(text)
}

const initializeTemplate = (version) => {
  const sourceUrl =  window.location.href.replace()
  const content = readTemplate(sourceUrl)
}

/**
 * buildHTML instantiates HTML nodes from a string.
 * @param {string} content Any text.
 * @returns {Object[]} An HTML node containing that content.
 */
const populateTemplate = (content) => {
  const template = document.createElement('template')
  template.innerHTML = content
  return template.content.cloneNode(true)
}

const populateReporting = (placeholder, content) => {
  const template = document.getElementsByName('template')[0]
  const contents = template.innerHtml
  var updatedContent = contents.replace(placeholder, content)
  populateTemplate(updatedContent)
}

const populateRemedies = (content) => {
  const template = document.getElementsByName('template')[0]
  const contents = template.innerHtml
  populateTemplate(contents.replace("[ Update with your custom enforcement policy ]", content))
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
