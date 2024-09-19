import React, { useState, useEffect } from 'react';
import { ScrollView, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { DataTable, IconButton, Searchbar } from 'react-native-paper';
import { styles } from './style';
import { Href, Link } from 'expo-router';
import {  MaterialCommunityIcons } from '@expo/vector-icons';

const numberOfItemsPerPageList = [5, 10, 15];

export default function CustomDatatable({
  data = [] as any[],
  columns = [] as any[],
  actions = {} as { editUrl?: boolean, delete?: (id: any) => void },
  pageSizeOptions = numberOfItemsPerPageList
}) {


  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(pageSizeOptions[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedFilter, setSelectedFilter] = useState(columns[0].key);

  const numberOfPages = Math.ceil(data.length / numberOfItemsPerPage);

  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, data.length);

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item[selectedFilter]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, selectedFilter, data]);

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Filtrar datos"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Lista horizontal de columnas por las que se puede filtrar */}
      <View style={styles.filterListContainer}>
        <FlatList
          horizontal
          data={columns}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                selectedFilter === item.key && styles.selectedFilterItem,
              ]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.key && styles.selectedFilterText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
        <DataTable style={styles.table}>
          <DataTable.Header style={styles.header}>
            {columns.map((col, index) => (
              <DataTable.Title key={index} textStyle={styles.title} numeric={col.numeric}>
                {col.label}
              </DataTable.Title>
            ))}
            {actions && <DataTable.Title textStyle={styles.title}>Acciones</DataTable.Title>}
          </DataTable.Header>

          {filteredData.slice(from, to).map((item, index) => (
            <DataTable.Row key={index} style={styles.row}>
              {columns.map((col, index) => (
                <DataTable.Cell key={index} numeric={col.numeric} style={styles.cell}>
                  {item[col.key]}
                </DataTable.Cell>
              ))}
              {actions && (
                <DataTable.Cell style={styles.cell}>
                  <View style={styles.actions}>
                    {actions.editUrl && (
                      <Link
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                      href={{
                        pathname: `/update/[id]`,
                        params: { id: item.id },

                      }}>
                      <MaterialCommunityIcons name="pencil" size={20} color="black" />
                    </Link>
                    )}
                    {actions.delete && (
                      <IconButton
                        icon="delete"
                        size={20}
                        iconColor="#dc3545"
                        onPress={() => actions.delete && actions.delete(item.id)}
                      />
                    )}
                  </View>
                </DataTable.Cell>
              )}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      {/* Paginación */}
      <View style={styles.paginationContainer}>
        <DataTable.Pagination
          page={page}
          numberOfPages={numberOfPages}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${filteredData.length}`}
          showFastPaginationControls
          numberOfItemsPerPageList={pageSizeOptions}
          numberOfItemsPerPage={numberOfItemsPerPage}
          onItemsPerPageChange={(number) => setNumberOfItemsPerPage(number)}
          selectPageDropdownLabel={'Filas por página'}
        />
      </View>
    </View>
  );
}

