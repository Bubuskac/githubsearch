import { StatusBar } from 'expo-status-bar';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View, Image } from 'react-native';
import Repo from './Repo';

export default class GitHubSearch extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            page: 0,
            result: [],
            selected: null
        };
    }

    async search() {
        let query = "?q=" + `${this.state.searchString} in:name`;
        let response = await fetch(`https://api.github.com/search/repositories${query}`);
        let result = await response.json();
        console.log(result);
        this.setState({
            page: 1,
            result: result.items,
            selected: null,
        });
    }

    selected(item) {
        this.setState({selected: item})
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.selected && 
                <View>
                    <Text>Repo name: {this.state.selected.name}</Text>
                    <Text>Description: {this.state.selected.description}</Text>
                    <Text>Owner: {this.state.selected.owner.login}</Text>
                    <Image style={styles.avatar} source={this.state.selected.owner.avatar_url}></Image>
                    <TouchableHighlight onPress={() => this.setState({selected: null})}>
                        <Text>Back</Text>
                    </TouchableHighlight>
                </View>}
                {!this.state.page && !this.state.selected &&
                 <View> 
                    <TextInput value={this.state.searchString} style={styles.input}
                        onChangeText={(value) => this.setState({searchString: value})} />
                    <TouchableHighlight onPress={() => this.search()}>
                        <Text>Search</Text>
                    </TouchableHighlight>
                </View>}
                {this.state.page > 0 && !this.state.selected && 
                    <FlatList
                        data={this.state.result}
                        renderItem={({item}) => {
                            return ( 
                                <Repo item={item} parent={this}/>
                            )
                        }}
                        extraData={this.state.page}
                        keyExtractor={item => item.id + ""}
                    />}
                <StatusBar style="auto" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
    },
    avatar: {
        height: 100,
        width: 100
    }
});
