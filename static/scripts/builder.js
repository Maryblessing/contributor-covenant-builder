const initializeBuilder = async (languageCode, version, reportingPlaceholder, enforcementPlaceholder) => {
  const versionPath = version.replace(".", "/")
  const sourceUrl =  window.location.href.replace("adopt/",`${languageCode.replace("en","")}/version/${versionPath}/code_of_conduct/code_of_conduct.md`)
  const content = await readTemplate(sourceUrl)
  const template = document.getElementById('template')
  const preview = document.getElementById('preview')
  if (!template || !preview) { return }

  // Immutable cache
  template.innerHTML = content
  preview.innerHTML = content

  const languageCodeElems = Array.from(document.getElementsByClassName('language'))
  languageCodeElems.forEach((elem) => {
    if (elem.id == languageCode) {
      elem.classList.add("highlight")
    } else {
      elem.classList.remove("highlight")
    }
  });

  const reportingField = document.getElementById('reporting')
  if (reportingField) {
    const escaped = reportingPlaceholder.replace(/[.*+\?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^.*${escaped}.*$`, 'mi')
    const match = content.match(regex)
    reportingField.value = match
    reportingField.dataset.placeholder = reportingPlaceholder
    reportingField.addEventListener("focus", (event) => {
      updatePreview('reporting')
    });
    reportingField.addEventListener("blur", (event) => {
      updatePreview('reporting')
    });
    reportingField.addEventListener("keyup", (event) => {
      updatePreview('reporting')
    });
  }

  const enforcementField = document.getElementById('enforcement')
  if (enforcementField) {
    const escaped = enforcementPlaceholder.replace(/[.*+\?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^.*${escaped}.*$`, 'mi')
    const match = content.match(regex)
    enforcementField.value = match
    enforcementField.dataset.placeholder = enforcementPlaceholder
    enforcementField.addEventListener("focus", (event) => {
      updatePreview('enforcement')
    });
    enforcementField.addEventListener("blur", (event) => {
      updatePreview('enforcement')
    });
    enforcementField.addEventListener("keyup", (event) => {
      updatePreview('enforcement')
    });
  }

}

const updatePreview = (elemId) => {
  const template = document.getElementById('template')
  const preview = document.getElementById('preview')
  const field = document.getElementById(elemId)
  if (!template || !preview) { return }

  const defaultText = template.innerHTML
  const matches = []
  let scrollToText = ""

  const customFields = document.getElementsByClassName('builder')
  const fieldsArray = Array.from(customFields)
  fieldsArray.forEach((field) => {
    const placeholder = field.dataset.placeholder
    const escaped = placeholder.replace(/[.*+\?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^.*${escaped}.*$`, 'mi')

    const match = defaultText.match(regex)
    if (match) {
      const replacement = field.value
      const matchJSON = { match: match[0], replacement: replacement }
      matches.push(matchJSON)
      if (field.id == elemId) { scrollToText = replacement }
    } else {
      field.value = "This feature is not supported by this version of Contributor Covenant. Please proceed to the next step."
    }
  });

  let buffer = defaultText
  matches.forEach((match) => { buffer = buffer.replace(match.match, match.replacement) });
  preview.innerHTML = buffer.replace('\n\n\n', '\n\n')

  scrollPreview(scrollToText)

  return preview
}

const clearHighlights = () => {
  const preview = document.getElementById('preview')
  const content = preview.innerHTML
  const clean = content.replace(/<\/?span[^>]*>/gi, '');
  preview.innerHTML = clean
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
    const index = textNode.nodeValue.indexOf(text)
    if (index === -1) return;

    const range = document.createRange()
    range.setStart(textNode, index)
    range.setEnd(textNode, index + text.length)
    const rect = range.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const offsetTop = rect.top - containerRect.top + container.scrollTop
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    const span = document.createElement('span')
    span.classList.add('highlight')
    range.surroundContents(span)
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
  clearHighlights()
}

const revealPreview = () => {
  preview = document.getElementById('preview')
  if (!preview) { return }
  preview.classList.remove('hidden')
}

const copyPreviewToClipboard = () => {
  const preview = document.getElementById('preview')
  if (!preview) { return }

  const completedText = preview.innerHTML
  const cleanText = completedText.replace(/<\/?span[^>]*>/gi, '');
  navigator.clipboard.writeText(cleanText).then(
    function () {
      console.log('Copied to clipboard.')
    },
    function (err) {
      console.error('Could not copy text: ', err)
    }
  )
}

const downloadPreview = () => {
  const preview = document.getElementById('preview')
  if (!preview) { return }

  const completedText = preview.innerHTML
  const cleanText = completedText.replace(/<\/?span[^>]*>/gi, '');
  const blob = new Blob([cleanText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "CODE_OF_CONDUCT.MD";
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const readTemplate = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error retrieving ${url}: ${response.status}`)
  }
  return await response.text()
}
