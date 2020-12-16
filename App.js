import { StatusBar } from 'expo-status-bar';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View, Image } from 'react-native';
import Repo from './Repo';

export default class GitHubSearch extends PureComponent {

    perPage = 10;
    resultNum = 0;
    
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            page: 0,
            result: [],
            selected: null,
            contributors: []
        };
    }

    async search(page) {
        try {
            let query = "?q=" + `${this.state.searchString} in:name` + `&page=${page}&per_page=${this.perPage}`;
            let response = await fetch(`https://api.github.com/search/repositories${query}`);
            let result = await response.json();
            console.log(result);
            this.resultNum = result.total_count;
            this.setState({
                page: page,
                result: result.items,
                selected: null,
            });
        } catch {
            console.error('Search failed.'); 
        }
    }

    async selected(item) {
        try {
            let response = await fetch(item.contributors_url);
            let result = await response.json();
            console.log(result);
            this.setState({
                selected: item,
                contributors: result
            });
        } catch {
            console.error('Item cannot be selected.');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.selected && 
                <View>
                    <Text>Repo name: {this.state.selected.name}</Text>
                    <Text>Owner: {this.state.selected.owner.login}</Text>
                    <Image style={styles.avatar} source={this.state.selected.owner.avatar_url}></Image>
                    <Text>Contributors:</Text>
                    <FlatList 
                        data={this.state.contributors}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.contributor}>
                                    <Image style={styles.avatar} source={item.avatar_url}></Image>
                                    <View>
                                        <Text>Name: {item.login}</Text>
                                        <Text>Number of contributions: {item.contributions}</Text>
                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={item => item.id + ""}
                    />
                    <TouchableHighlight style={styles.button} onPress={() => this.setState({selected: null})}>
                        <Text>Back</Text>
                    </TouchableHighlight>
                </View>}
                {!this.state.page && !this.state.selected &&
                 <View> 
                    <TextInput value={this.state.searchString} style={styles.input}
                        onChangeText={(value) => this.setState({searchString: value})} />
                    <TouchableHighlight style={styles.button} onPress={() => this.search(1)}>
                        <Text>Search</Text>
                    </TouchableHighlight>
                </View>}
                {this.state.page > 0 && !this.state.selected && 
                    <View>
                        <FlatList
                            data={this.state.result}
                            renderItem={({item}) => {
                                return ( 
                                    <Repo item={item} parent={this}/>
                                );
                            }}
                            extraData={this.state.page}
                            keyExtractor={item => item.id + ""}
                        />
                        <View style={styles.contributor}>
                        {this.state.page > 1 &&
                        <TouchableHighlight style={styles.button} onPress={() => this.search(this.state.page - 1)}>
                            <Text>Previous</Text>
                        </TouchableHighlight>}
                        {this.state.page * this.perPage < this.resultNum &&
                        <TouchableHighlight style={styles.button} onPress={() => this.search(this.state.page + 1)}>
                            <Text>Next</Text>
                        </TouchableHighlight>}
                        </View>
                    </View>}
                    <TouchableHighlight style={styles.button} onPress={() => this.setState({
                        page: 0,
                        searchString: '',
                        selected: null,
                    })}>
                        <Text>New Search</Text>
                    </TouchableHighlight>
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
        width: 100,
    },
    button: {
        backgroundColor: '#ccc',
        margin: 5,
    },
    contributor: {
        display: "flex",
        flexDirection: "row",
    }
});
