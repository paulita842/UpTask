import React, {useState} from 'react';

import {View} from 'react-native';

import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Toast,
  Text,
  VStack,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Apollo
import {gql, useMutation} from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  //state del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  //navegación
  const navigation = useNavigation();

  //mutation de apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  //cuando el usuario inicia sesión
  const handleSubmit = async () => {
    //validar si el correo existe
    if (email === '' || password === '') {
      //mostrar alerta con error
      setMensaje('Todos los campos son obligatorios');

      return;
    }
    //iniciar sesión
    try {
      //autenticar el usuario
      const {data} = await autenticarUsuario({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      const {token} = data.autenticarUsuario;
      //colocar token en storage
      await AsyncStorage.setItem('token', token);

      //Redireccionar
      navigation.navigate('Proyectos');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  //muestra un mensaje toast
  const mostrarAlerta = () => {
    Toast.show({
      description: mensaje,
    });
  };
  return (
    <>
      <NativeBaseProvider>
        <View
          style={[
            globalStyles.contenedor,
            {backgroundColor: '#e84347' || undefined},
          ]}>
          <View style={globalStyles.contenido}>
            <VStack space={1} alignItems="center">
              <Text fontSize="4xl" bold style={globalStyles.titulo}>
                UpTask
              </Text>
            </VStack>

            <FormControl>
              <Input
                onChangeText={text => setEmail(text.toLowerCase())}
                value={email}
                placeholder="Email"
                mx="1"
                backgroundColor={'#fff'}
                marginBottom={5}
              />
              <Input
                mx="1"
                backgroundColor={'#fff'}
                marginBottom={5}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
              />
            </FormControl>
            <Button
              square
              block
              backgroundColor={'#28303b'}
              marginTop={10}
              onPress={() => handleSubmit()}>
              <Text textTransform={'uppercase'} bold color={'#fff'}>
                Iniciar Sesión
              </Text>
            </Button>

            <Text
              fontSize={'md'}
              bold
              style={globalStyles.enlace}
              onPress={() => navigation.navigate('CrearCuenta')}>
              Crear Cuenta
            </Text>
            {mensaje && mostrarAlerta()}
          </View>
        </View>
      </NativeBaseProvider>
    </>
  );
};

export default Login;
