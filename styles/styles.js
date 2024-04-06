import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#C62A47",
        borderRadius: 50,
        padding: 10,
        margin: 14,
        width: "70%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
        alignSelf: "center",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "gray",
        borderWidth: 2,
        marginBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 10,
        fontSize: 16,
      },
      tile: {
        width: 320,
        height: 150,
        padding: 0,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#C62A47",
        margin: 15,
      },
      tileImage: {
        flex: 1, 
        width: null, 
        height: null, 
        resizeMode: 'cover', 
        borderRadius:10 
      },
});

export default styles;