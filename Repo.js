import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';

export default class Repo extends PureComponent  {

    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            parent: props.parent
        };
    }

    render() {
        const {item, parent} = this.state;
        return (
            <TouchableHighlight onPress={() => parent.selected.call(parent, item)}>
                <View style={styles.item}>
                    <View style={styles.repo}>
                        <Text>Repo name: {item.name}</Text>
                        <Text>Description: {item.description}</Text>
                    </View>
                    <View style={styles.repo}>
                        <Text>Owner: {item.owner.login}</Text>
                        <Image style={styles.avatar} source={item.owner.avatar_url}></Image>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        display: "flex",
        flexDirection: "row",
    },
    repo: {
        flex: 1,
        borderColor: "black",
        borderWidth: 1,
        padding: 2,
    },
    avatar: {
        width: 50,
        height: 50,
    }
});