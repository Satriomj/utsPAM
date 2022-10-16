import * as React from 'react';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from '@rneui/base';
import { TextInput, Title } from 'react-native-paper';
import { ListItem, Text, Card } from '@rneui/themed';
import { Audio } from 'expo-av';
import * as SecureStore from 'expo-secure-store';
var DATA = [
  {
    id: 1,
    nama: 'apa ya buat',
    uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540satrio12%252Futs/Audio/recording-8aaaae8c-78a8-48af-8647-a6b39b257a43.m4a',
  },
  {
    id: 2,
    nama: 'catatan 1',
    uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540satrio12%252Futs/Audio/recording-8aaaae8c-78a8-48af-8647-a6b39b257a43.m4a',
  },
  {
    id: 3,
    nama: 'halo',
    uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540satrio12%252Futs/Audio/recording-ab6895ab-c222-426b-a311-9b0adef22253.m4a',
  },
];
import {
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack';
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
  // cek();
}
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
function Home({ navigation }) {
  const [balek, setBalek] = useState(false);
  const [datas, setDatas] = useState([
  {
    id: 1,
    nama: 'apa ya buat',
    uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540satrio12%252Futs/Audio/recording-8aaaae8c-78a8-48af-8647-a6b39b257a43.m4a',
  },
  {
    id: 2,
    nama: 'catatan 1',
    uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540satrio12%252Futs/Audio/recording-8aaaae8c-78a8-48af-8647-a6b39b257a43.m4a',
  }]);
  // SecureStore.getItemAsync('SATRIOOO').then((datass) => {
  //   setDatas(datass);
  // });
  // setDatas([...DATA]);
  let fact = datas != undefined ? datas : [];
  const handleRef = () => {
    setDatas([...DATA]);
  };
  // const res = DATA.map((item, idx) =>
  //   (<Pressable
  //     onPress={() =>
  //       navigation.navigate('Detail', {
  //         id: idx,
  //         nama: item.nama,
  //         uri: item.uri,
  //       })
  //     }>
  //     <Card>
  //       <Card.Title>{item.nama}</Card.Title>
  //     </Card>
  //   </Pressable>;
  // ));
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {datas.map((item) => (
        <Pressable
          onPress={() =>
            navigation.navigate('Detail', {
              id: item.id,
              nama: item.nama,
              uri: item.uri,
            })
          }>
          <Card>
            <Card.Title>{item.nama}</Card.Title>
          </Card>
        </Pressable>
      ))}
      <Pressable
        onPress={() => navigation.navigate('New')}
        style={{ backgroundColor: 'plum', padding: 10 }}>
        <Text>Story</Text>
      </Pressable>
      <Pressable onPress={handleRef}>
        <Text>refresh</Text>
      </Pressable>
    </View>
  );
}
const Detail = ({ route, navigation }) => {
  const [sound, setSound] = React.useState();
  const { id, nama, uri } = route.params;
  async function playSound() {
    console.log('Loading Sound');
    console.log(uri);
    const { sound } = await Audio.Sound.createAsync({ uri: uri });
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 10,
      }}>
      <Title>{nama}</Title>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
};

function New({ navigation }) {
  const [data, setData] = React.useState([]);
  const [uri, setUri] = React.useState('');
  useState(() => {
    getValueFor('SATRIOOO')
      .then((res) => JSON.parse(res))
      .then((res) => {
        if (res != null) {
          setData(res);
        } else {
          setData([]);
        }
      });
  }, []);
  const [text, setText] = React.useState();
  const [recording, setRecording] = React.useState();
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  function saveDATA(data) {
    DATA = [...DATA, { nama: text, uri: uriRec }];
  }
  const storeData = async () => {
    // console.log(DATA);
    navigation.navigate('Home');
    // const jsonValue = JSON.stringify(data);
    // await save('SATRIOOO', jsonValue);
  };

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uriRec = recording.getURI();
    setUri(uriRec);
    console.log('Recording stopped and stored at', uriRec);
    setData([...data, { nama: text, uri: uriRec }]);
    saveDATA();
  }
  return (
    <View style={{}}>
      <Text>{uri}</Text>
      <Text>{text}</Text>
      <TextInput
        label="Nama Note"
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button style={{ marginTop: 20 }} title={'save'} onPress={storeData} />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerLeft: (props) => {
            return <>{props.canGoBack && <HeaderBackButton {...props} />}</>;
          },
        })}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="New" component={New} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
