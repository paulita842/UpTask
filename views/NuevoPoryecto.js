import React, {useState} from 'react';

import {View} from 'react-native';

import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Toast,
  Text,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';

import globalStyles from '../styles/globalStyles';

const NUEVO_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input: $input) {
      nombre
      id
    }
  }
`;
//ACTUALIZAR EL CACHE
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const NuevoPoryecto = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  //apollo

  const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
    update(cache, {data: {nuevoProyecto}}) {
      const {obtenerProyectos} = cache.readQuery({
        query: OBTENER_PROYECTOS,
      }) ?? {
        obtenerProyectos: [],
      };
      cache.writeQuery({
        query: OBTENER_PROYECTOS,
        data: {obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])},
      });
    },
  });

  //navigation
  const navigation = useNavigation();

  //muestra un mensaje toast
  const mostrarAlerta = () => {
    Toast.show({
      description: mensaje,
    });
  };

  //Validar crear proyecto
  const handleSubmit = async () => {
    if (nombre === '') {
      setMensaje('El Nombre del Proyecto es Obligatorio');
      return;
    }

    //guardar el proyecto en la BD

    try {
      const {data} = await nuevoProyecto({
        variables: {
          input: {
            nombre,
          },
        },
      });
      setMensaje('Proyecto Creado Correctamente');
      navigation.navigate('Proyectos');
    } catch (error) {
      setMensaje(error.message);
    }
  };
  return (
    <NativeBaseProvider>
      <View
        style={[
          globalStyles.contenedor,
          {backgroundColor: '#e84347' || undefined},
        ]}>
        <View style={globalStyles.contenido}>
          <Text fontSize={'xl'} bold style={globalStyles.subtitulo}>
            Nuevo Proyecto
          </Text>
          <FormControl>
            <Input
              onChangeText={text => setNombre(text)}
              placeholder="Nombre del Proyecto"
              mx="1"
              backgroundColor={'#fff'}
              marginBottom={5}
            />
          </FormControl>
          <Button
            square
            block
            backgroundColor={'#28303b'}
            marginTop={10}
            onPress={() => handleSubmit()}>
            <Text textTransform={'uppercase'} bold color={'#fff'}>
              Crear Proyecto
            </Text>
          </Button>
        </View>
        {mensaje && mostrarAlerta()}
      </View>
    </NativeBaseProvider>
  );
};

export default NuevoPoryecto;
