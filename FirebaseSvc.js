import firebase from 'firebase';
import uuid from 'uuid';

const config = {
  apiKey: 'AIzaSyBrZlOTsM1xx0iK2jsPj5MkomjPqTD9fU0',
  authDomain: 'chat-6c51e.firebaseapp.com',
  databaseURL: 'https://chat-6c51e.firebaseio.com',
  projectId: 'chat-6c51e',
  storageBucket: 'chat-6c51e.appspot.com',
  messagingSenderId: '575073531881',
  appId: '1:575073531881:web:3e8acf1d4769373acabd78',
};

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log('firebase já está rodando');
    }
  }

  login = async (user, success_callback, failed_callback) => {
    console.log('Logando', user);
    const output = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log('Falhou:' + message);
      }
    } else {
      console.log('Auth...');
    }
  };

  createAccount = async user => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function() {
          console.log(
            'User criado com sucesso. Email:' +
              user.email +
              ' nome:' +
              user.name
          );
          var userf = firebase.auth().currentUser;
          userf.updateProfile({ displayName: user.name }).then(
            function() {
              alert(
                'User ' + user.name + ' User criado com sucesso. Por favor, faça o login'
              );
            },
            function(error) {
              console.warn('Erro ao atualizar o DisplayName.');
            }
          );
        },
        function(error) {
          console.error(
            'got error:' + typeof error + ' string:' + error.message
          );
          alert('Create account failed. Error: ' + error.message);
        }
      );
  };

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
            /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL)
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  };

  updateAvatar = url => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url }).then(
        function() {
          console.log('Updated avatar successfully. url:' + url);
          alert('Avatar image is saved successfully.');
        },
        function(error) {
          console.warn('Error update avatar.');
          alert('Error update avatar. Error:' + error.message);
        }
      );
    } else {
      console.log("can't update avatar, user is not login.");
      alert('Unable to update avatar. You must login first.');
    }
  };

  onLogout = user => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('Sign-out successful.');
      })
      .catch(function(error) {
        console.log('An error happened when signing out');
      });
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
