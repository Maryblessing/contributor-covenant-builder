const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}

const initializeBuilder = async (version) => {
  const versionPath = version.replace(".", "/")
  const sourceUrl =  window.location.href.replace("adopt/",`version/${versionPath}/code_of_conduct/code_of_conduct.md`)
  const content = await readTemplate(sourceUrl)
  const preview = document.getElementById('preview')
  preview.innerHTML = content
}

const initializeReportingField = (placeholder) => {
  const preview = document.getElementById('preview')
  const reportingField = document.getElementById('reporting')
  if (reportingField) {
    reportingField.value = placeholder
  }
}

const updateTemplate = (placeholder, content) => {
  const preview = document.getElementById('preview')
  if (preview) {
    const contents = preview.content
    const updatedContent = contents.replace(placeholder, content)
    preview.innerHTML = updatedContent
  }
  return preview
}

const revealStep = (elemId) => {
  const steps = document.querySelectorAll('.step');
  const elem = document.getElementById(elemId);
  steps.forEach((step, i) => {
    step.classList.add('hidden');
  });
  elem.classList.remove('hidden');
}
