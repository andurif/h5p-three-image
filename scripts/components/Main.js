import React from 'react';
import Audio from "./Scene/Audio";
import Scene from "./Scene/Scene";
import ImagePopup from "./ImageScene/ImagePopup";
import TextDialog from "./Shared/TextDialog";
import SceneDescription from "./Scene/SceneDescription";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    let startScene = 0;
    if (this.props.forceStartScreen) {
      startScene = this.props.forceStartScreen;
    }
    this.currentScene = startScene;

    const isShowingAudio = this.props.parameters.audio
      && this.props.parameters.audio[0]
      && this.props.parameters.audio[0].path;

    this.state = {
      currentScene: startScene,
      currentImage: null,
      showingImagePopup: false,
      showingTextDialog: false,
      currentText: null,
      isShowingAudio: isShowingAudio,
    };
  }

  navigateToScene(sceneName) {
    const newScene = this.props.parameters.scenes.findIndex(scene => {
      return scene.scenename === sceneName;
    });

    this.setState({
      currentScene: newScene,
    });
  }

  showImage(image) {
    this.setState({
      currentImage: image,
      showingImagePopup: true,
    });
  }

  hidePopup() {
    this.setState({
      currentImage: null,
      showingImagePopup: false,
    });
  }

  showTextDialog(text) {
    this.setState({
      showingTextDialog: true,
      currentText: text,
    });
  }

  hideTextDialog() {
    this.setState({
      showingTextDialog: false,
      currentText: null,
    });
  }

  render() {
    const sceneParams = this.props.parameters.scenes;
    const description = sceneParams[this.state.currentScene].scenedescription;

    const isShowingSceneDescription = !this.state.showingTextDialog
      && !this.state.showingImagePopup
      && description;

    return (
      <div>
        {
          isShowingSceneDescription &&
          <SceneDescription
            text={description}
            showTextDialog={this.showTextDialog.bind(this)}
          />
        }
        {
          this.state.isShowingAudio &&
          <Audio
            audioSrc={H5P.getPath(
              this.props.parameters.audio[0].path,
              this.props.contentId
            )}
          />
        }
        {
          this.state.showingTextDialog && this.state.currentText &&
          <TextDialog
            onHideTextDialog={this.hideTextDialog.bind(this)}
            text={this.state.currentText}
          />
        }
        {
          this.state.showingImagePopup && this.state.currentImage &&
          <ImagePopup
            onHidePopup={this.hidePopup.bind(this)}
            imageSrc={H5P.getPath(
              this.state.currentImage.imagesrc.path,
              this.props.contentId
            )}
            imageTexts={this.state.currentImage.imagetexts}
            showTextDialog={this.showTextDialog.bind(this)}
          />
        }
        {
          this.props.parameters.scenes.map((sceneParams, sceneIndex) => {
            return (
              <Scene
                key={sceneIndex}
                isActive={sceneIndex === this.state.currentScene}
                sceneParams={sceneParams}
                imageSrc={H5P.getPath(sceneParams.scenesrc.path, this.props.contentId)}
                navigateToScene={this.navigateToScene.bind(this)}
                showImage={this.showImage.bind(this)}
              />
            );
          })
        }
      </div>
    );
  }
}

