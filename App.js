import * as React from "react";
import { AsyncStorage, Button, Text, TextInput, View } from "react-native";
import { NavigationNativeContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/core";

// TODO
// tab navigation ?
// log out

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Welcome home!</Text>
      <Button
        title="Go to Settings"
        onPress={() => {
          navigation.navigate("Settings", { itemId: 123 });
        }}
      />
    </View>
  );
}

function SettingsScreen({ setToken, someParam }) {
  const { params } = useRoute();
  console.log(params.itemId); // 123
  return (
    <View>
      <Text>Hello Settings: </Text>

      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
        }}
      />
    </View>
  );
}

function SignInScreen({ setToken }) {
  return (
    <View>
      <View>
        <Text>Name: </Text>
        <TextInput placeholder="Username" />
        <Text>Password: </Text>
        <TextInput placeholder="Password" secureTextEntry={true} />
        <Button
          title="Sign in"
          mode="contained"
          onPress={async () => {
            const userToken = "secret-token";
            setToken(userToken);
          }}
        />
      </View>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const setToken = async token => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
      setUserToken(userToken);
    };

    bootstrapAsync();
  }, []);

  const Stack = createStackNavigator();

  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        {isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={() => null} />
        ) : userToken === null ? (
          // No token found, user isn't signed in
          <Stack.Screen name="SignIn" options={{ header: () => null }}>
            {() => <SignInScreen setToken={setToken} />}
          </Stack.Screen>
        ) : (
          // User is signed in
          <>
            <Stack.Screen name="Home" options={{ title: "My App" }}>
              {() => <HomeScreen />}
            </Stack.Screen>
            <Stack.Screen name="Settings">
              {() => <SettingsScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
