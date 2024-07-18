import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    flex: 1,
  },

  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },

  enlace: {
    marginTop: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#fff',
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    marginTop: 20,
  },
});

export default globalStyles;
