const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}

const initializeTemplate = async (version) => {
  const sourceUrl =  window.location.href.replace("adopt/",`version/${version}/code_of_conduct/code_of_conduct.md`)
  const content = await readTemplate(sourceUrl)
  const template = document.createElement('template')
  template.id = 'template'
  template.innerHTML = content
  document.body.appendChild(template)
  return template
}

const populateReporting = (placeholder, content) => {
  const template = document.getElementsByName('template')[0]
  const contents = template.innerHtml
  var updatedContent = contents.replace(placeholder, content)
  populateTemplate(updatedContent)
}

const populateRemedies = (content) => {
  const template = document.getElementById('template')
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
