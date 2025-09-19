

    import {View, StyleSheet, Text, TouchableOpacity,  Linking, Alert} from "react-native"

    const PortailInscription = () =>{

        const glpiPortalUrl = "https://glpi.afrikpay.com/front/user.php"; //  URL GLPI
      

        const handleOpenPortal = () => {
            Linking.openURL(glpiPortalUrl)
              .then(() => {
                Alert.alert(
                  "Inscription",
                  "Veuillez créer votre compte sur le portail GLPI. Revenez ensuite à l'application pour vous connecter."
                );
              })
              .catch((err) => {
                Alert.alert("Erreur", "Impossible d'ouvrir le portail d'inscription");
                console.error(err);
              });
          };

        return (
                 <TouchableOpacity style={styles.button} onPress={handleOpenPortal}>
                    <Text style={styles.buttonText}>Ouvrir le portail d'inscription</Text>
                  </TouchableOpacity>

        )
    }

    export default PortailInscription;

    const styles = StyleSheet.create({

        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            backgroundColor: "#fff",
          },
          fullContainer: {
            flex: 1,
          },
          title: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          },
          description: {
            fontSize: 16,
            textAlign: "center",
            marginBottom: 30,
            color: "#666",
          },
          button: {
            width: "100%",
            backgroundColor: "#3366E0",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 15,
          },
          buttonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          },
          link: {
            color: "#3366E0",
            fontSize: 14,
            marginTop: 10,
            textDecorationLine: "underline",
          },
    })