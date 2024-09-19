import { StyleSheet } from "react-native";
import { theme } from '@/assets/css/style';


export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchbar: {
    borderRadius: 8,
  },
  filterListContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterItem: {
    padding: 10,
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilterItem: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    color: '#333',
  },
  selectedFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollArea: {
    flexGrow: 0,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    minWidth: 600,
    marginTop: 20
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row', // added
    alignItems: 'center', // added
    justifyContent: 'space-between', // added
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1, // added
    textAlign: 'left', // added
    paddingLeft: 16, 
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  paginationContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  
  
})