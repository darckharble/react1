import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import firebaseSvc from '../FirebaseSvc';

type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};

class Chat extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };

  get user() {
    
    
    return {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      avatar: this.props.navigation.state.params.avatar,
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }

  render() {
    console.log("nome no chat ", this.user);
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        placeholder="Digite sua mensagem"
        user={this.user}
        showUserAvatar={true}
      />
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}

export default Chat;
