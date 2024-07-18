import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {
  NativeBaseProvider,
  Button,
  Input,
  FormControl,
  Toast,
  Text,
  FlatList,
  CheckCircleIcon,
} from 'native-base';

import globalStyles from '../styles/globalStyles';

import {gql, useMutation, useQuery} from '@apollo/client';

//crear nuevas tareas
const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput) {
    nuevaTarea(input: $input) {
      nombre
      id
      proyecto
      estado
    }
  }
`;

//consultar las tareas del proyecto
const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input) {
      id
      nombre
      estado
    }
  }
`;

//actualizar tarea
const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input: TareaInput!, $estado: Boolean!) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
      id
      nombre
      estado
    }
  }
`;

//Eliminar tarea de la base de datos
const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id)
  }
`;

const Proyecto = ({route}) => {
  const {id} = route.params.proyecto;

  //state del componente

  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  //apollo obtener tareas
  const {
    data,
    loading,
    error: errorTareas,
  } = useQuery(OBTENER_TAREAS, {
    variables: {
      input: {
        proyecto: id,
      },
    },
  });

  //APOLLO crear tareas
  const [nuevaTarea] = useMutation(NUEVA_TAREA);

  //APOLLO actualizar tarea
  const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);

  const [eliminarTarea] = useMutation(ELIMINAR_TAREA);

  //validar y  crear tareas
  const handleSubmit = async () => {
    if (nombre === '') {
      setMensaje('El nombre de la tarea es obligatorio');
      return;
    }
    //almacenarlo en la base de datos
    try {
      const {data} = await nuevaTarea({
        variables: {
          input: {
            nombre,
            proyecto: id,
          },
        },
      });
      console.log(data);
      setNombre('');
      setMensaje('Tarea creada correctamente');
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  //muestra un mensaje toast
  const mostrarAlerta = () => {
    Toast.show({
      description: mensaje,
    });
  };

  //cambia el estado de las tareas
  const cambiarEstado = async (estado, id, nombre) => {
    try {
      const {data} = await actualizarTarea({
        variables: {
          id: id,
          input: {
            nombre: nombre,
          },
          estado: !estado,
        },
      });
    } catch (error) {
      console.log('ERROR DEL CATCH', error);
    }
  };

  //Dialogo para eliminar una tarea o no
  const mostrarEliminar = idDelete => {
    Alert.alert('Eliminar Tarea', '¿Desea eliminar esta tarea?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => eliminarTareaDB(idDelete),
      },
    ]);
  };

  //Eliminar tarea de la base de datos

  const eliminarTareaDB = async id => {
    try {
      const {data} = await eliminarTarea({
        variables: {
          id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onLongPress={() => mostrarEliminar(item.id)}
        onPress={() => cambiarEstado(item.estado, item.id, item.nombre)}>
        <View style={styles.contenido}>
          <Text marginLeft={5}>{item.nombre}</Text>
          <View style={styles.separator} />
          <View style={{marginHorizontal: 325, marginTop: -20}}>
            {item.estado ? (
              <CheckCircleIcon size="5" mt="0.5" style={styles.completo} />
            ) : (
              <CheckCircleIcon size="5" mt="0.5" color="grey" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <NativeBaseProvider>
      <View
        style={[
          globalStyles.contenedor,
          {backgroundColor: '#e84347' || undefined},
        ]}>
        <View style={{marginHorizontal: '2.5%', marginTop: 20}}>
          <FormControl>
            <Input
              placeholder="Nombre Tarea"
              mx="1"
              backgroundColor={'#fff'}
              marginBottom={4}
              height={10}
              value={nombre}
              onChangeText={texto => setNombre(texto)}
            />
          </FormControl>
          <Button
            square
            block
            backgroundColor={'#28303b'}
            onPress={() => handleSubmit()}>
            <Text textTransform={'uppercase'} bold color={'#fff'}>
              Crear Tarea
            </Text>
          </Button>
        </View>
        <Text bold style={globalStyles.subtitulo} fontSize={'xl'}>
          Tareas: {route.params.proyecto.nombre}
        </Text>
        <FlatList
          data={data?.obtenerTareas || []}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
        {mensaje && mostrarAlerta()}
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#fff',
    marginHorizontal: '2,5%',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  text: {
    marginLeft: 15,
  },

  completo: {
    color: 'green',
  },
});

export default Proyecto;
