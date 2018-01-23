import React, { Component } from "react";

import createCore from "./module/core/base";
import createDragDrop from "./module/plugin/dragDrop";

class App extends Component {
  selectors = {
    area: ".area",
    browse: ".browse"
  };

  componentDidMount() {
    const mod = createCore();
    // mod.addFile({
    //   name: "Test",
    //   meta: { size: 3000, lastModified: Date.now() }
    // });
    window.mod = mod;
    createDragDrop(mod, { selectors: this.selectors });
  }

  render() {
    return (
      <div className="App">
        <input
          className="area"
          type="file"
          name="files[]"
          multiple="true"
          style={{ width: "400px", height: "400px", backgroundColor: "gray" }}
        />
        <label className="browse">browse</label>
      </div>
    );
  }
}

export default App;
