const initializeBuilder = async (version) => {
  const versionPath = version.replace(".", "/")
  const sourceUrl =  window.location.href.replace("adopt/",`version/${versionPath}/code_of_conduct/code_of_conduct.md`)
  const content = await readTemplate(sourceUrl)
  const template = document.getElementById('template')
  const preview = document.getElementById('preview')
  if (!template || !preview) { return }

  // Immutable cache
  template.innerHTML = content
  preview.innerHTML = content

  const reportingField = document.getElementById('reporting')
  if (reportingField) {
    const placeholder = reportingField.dataset.placeholder
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^.*${escaped}.*$`, 'm')
    const match = content.match(regex)
    reportingField.value = match
    reportingField.addEventListener("focus", (event) => {
      updateTemplate('reporting')
    });
    reportingField.addEventListener("blur", (event) => {
      updateTemplate('reporting')
    });
  }

  const enforcementField = document.getElementById('enforcement')
  if (enforcementField) {
    const placeholder = enforcementField.dataset.placeholder
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^.*${escaped}.*$`, 'm')
    const match = content.match(regex)
    enforcementField.value = match
    enforcementField.addEventListener("focus", (event) => {
      updateTemplate('enforcement')
    });
    enforcementField.addEventListener("blur", (event) => {
      updateTemplate('enforcement')
    });
  }

}

const updateTemplate = (elemId) => {
  const template = document.getElementById('template')
  const preview = document.getElementById('preview')
  const field = document.getElementById(elemId)
  if (!template || !field) { return }

  const placeholder = field.dataset.placeholder
  const escaped = placeholder.replace(/[.*+\?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`^.*${escaped}.*$`, 'mi')
  const content = template.innerHTML
  const replacement = field.value
  const match = content.match(regex)
  const updatedContent = content.replace(match, replacement).replace('\n\n\n', '\n\n')
  preview.innerHTML = updatedContent
  scrollPreview(replacement)
  return template
}

const scrollPreview = (text) => {
  const container = document.getElementById('preview')
  if (!container) { return }

  const treeWalker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        return node.nodeValue.includes(text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    },
    false
  );

  const textNode = treeWalker.nextNode()
  if (textNode) {
    const index = textNode.nodeValue.indexOf(text);
    if (index === -1) return;

    const range = document.createRange();
    range.setStart(textNode, index);
    range.setEnd(textNode, index + text.length);    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const offsetTop = rect.top - containerRect.top + container.scrollTop
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    range.surroundContents(span);
  }

}

const revealStep = (elemId) => {
  const steps = document.querySelectorAll('.step')
  const elem = document.getElementById(elemId)
  if (!elem) { return }

  steps.forEach((step, i) => {
    step.classList.add('hidden')
  });
  elem.classList.remove('hidden')
}

const copyPreviewToClipboard = () => {
  const preview = document.getElementById('preview')
  if (!preview) { return }

  const completedText = preview.innerHTML.replace()
  const regex = RegExp('<span.+</?span>\n','m')
  const match = completedText.match(regex)
  const cleanText = completedText.replace(match, "")
  navigator.clipboard.writeText(cleanText).then(
    function () {
      console.log('Copied to clipboard.')
    },
    function (err) {
      console.error('Could not copy text: ', err)
    }
  )
}

const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}
