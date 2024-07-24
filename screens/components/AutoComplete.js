import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Autocomplete = ({ data, resultFunction, placeholder, exclude }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const filtered = data.filter(item => item.toLowerCase().includes(text.toLowerCase()));
      if(exclude != null && exclude.length > 0){
        const result = filtered.filter(item => !exclude.includes(item));
        setFilteredData(result);
      }
      else{
        setFilteredData(filtered);
      }
      
    } else {
      setFilteredData([]);
    }
  };

  const handleSelectItem = (item) => {
    if(resultFunction != null){
        resultFunction(item);
    }
    setQuery('');
    setFilteredData([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder = {placeholder == null ?  "Search..."  : placeholder}
        value={query}
        onChangeText={handleSearch}
      />
      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
              <Text style={{fontSize:14}}>{item}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Autocomplete;