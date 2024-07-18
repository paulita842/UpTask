import React, {useState} from 'react';

import {View} from 'react-native';

import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Text,
  VStack,
  Toast,
} from 'native-base';

import {useNavigation} from '@react-navigation/native';

import globalStyles from '../styles/globalStyles';

//Apollo
import {gql, useMutation} from '@apollo/client';

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const CrearCuenta = () => {
  //state del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  //navigation
  const navigation = useNavigation();

  //Mutation de apollo
  const [crearUsuario] = useMutation(NUEVA_CUENTA);

  //Cuando el usuario presiona en crear cuenta

  const handleSubmit = async () => {
    //validar

    if (nombre === '' || email === '' || password === '') {
      //mostrar alerta con error
      setMensaje('Todos los campos son obligatorios');

      return;
    }
    //password de al menos 6 caracteres
    if (password.length < 6) {
      setMensaje('El password debe ser de al menos 6 caracteres');
    }
    //guardar usuario
    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password,
          },
        },
      });

      setMensaje(data.crearUsuario);
      navigation.navigate('Login');
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
                onChangeText={texto => setNombre(texto)}
                placeholder="Nombre"
                mx="1"
                backgroundColor={'#fff'}
                marginBottom={5}
              />
              <Input
                onChangeText={texto => setEmail(texto)}
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
                onChangeText={texto => setPassword(texto)}
              />
            </FormControl>
            <Button
              square
              block
              backgroundColor={'#28303b'}
              marginTop={10}
              onPress={() => handleSubmit()}>
              <Text textTransform={'uppercase'} bold color={'#fff'}>
                Crear Cuenta
              </Text>
            </Button>
            {mensaje && mostrarAlerta()}
          </View>
        </View>
      </NativeBaseProvider>
    </>
  );
};

export default CrearCuenta;
