<template>
  <div v-if="open">
      <iframe id="graph" class="h-screen w-screen flex" :src="updatedUrl"></iframe>
  </div>
</template>

<script>
function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement("style");

      Array.from(styleSheet.cssRules).forEach(cssRule => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement("link");

      newLinkEl.rel = "stylesheet";
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

export default {
  name: 'window-portal',
  model: {
    prop: 'open',
    event: 'close'
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    nodeLevel: String,
    nodeClass: String
  },
  data() {
    return {
      windowRef: null,
      updatedUrl: this.getActualUrl()
    }
  },
  watch: {
    open(newOpen) {
      if(newOpen) {
        this.openPortal();
      } else {
        this.closePortal();
      }
    },
    nodeLevel(newLevel){
      if(newLevel){
        console.log(this.updateUrl());
      }
    },
    nodeClass(newClass){
      if(newClass){
        console.log(this.updateUrl());
      }
    }
  },
  methods: {
    updateUrl(){
      let base = this.getActualUrl();
      console.log(`classe : ${this.nodeClass}`)
      console.log(`level : ${this.nodeLevel}`)
      if (this.nodeClass){
        base = base.concat(`?nodeClass=${this.nodeClass}`);
      }
      if (this.nodeLevel){
        base = base.concat(`&level=${this.nodeLevel}`);
      }
      this.updatedUrl = encodeURI(base);
      this.windowRef.document.getElementById("graph").contentWindow.location.reload();
      this.iframeLoaded = false;
      return this.updatedUrl;
    },
    getActualUrl(){
      return `${window.location.origin}/graph`;
    },
    openPortal() {
      this.windowRef = window.open("", "", "width=1920,height=1080,left=200,top=200");
      this.windowRef.document.body.appendChild(this.$el);
      copyStyles(window.document, this.windowRef.document);
      this.windowRef.addEventListener('beforeunload', this.closePortal);
    },
    closePortal() {
      if(this.windowRef) {
        this.windowRef.close();
        this.windowRef = null;
        this.$emit('close');
      }
    }
  },
  mounted() {
    if(this.open) {
      this.openPortal();
    }
  },
  beforeUnmount() {
    if (this.windowRef) {
      this.closePortal();
    }
  }
}
</script>