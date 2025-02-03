import java.util.*;

class Node implements Comparable<Node> {
    String name;
    int cost;
    List<String> path;

    public Node(String name, int cost, List<String> path) {
        this.name = name;
        this.cost = cost;
        this.path = new ArrayList<>(path);
        this.path.add(name);
    }

    @Override
    public int compareTo(Node other) {
        return Integer.compare(this.cost, other.cost);
    }
}

public class DijkstraToll {
    public static Map<String, List<AbstractMap.SimpleEntry<String, Integer>>> graph = new HashMap<>();
    public static Set<String> chargingStations = new HashSet<>();
    public static Set<String> tollPoints = new HashSet<>();

    public static void addEdge(String u, String v, int weight) {
        graph.computeIfAbsent(u, k -> new ArrayList<>()).add(new AbstractMap.SimpleEntry<>(v, weight));
    }

    public static Pair<Integer, List<String>> dijkstra(String start, String end) {
        PriorityQueue<Node> pq = new PriorityQueue<>();
        Set<String> visited = new HashSet<>();
        pq.add(new Node(start, 0, new ArrayList<>()));

        while (!pq.isEmpty()) {
            Node current = pq.poll();

            if (visited.contains(current.name)) continue;
            visited.add(current.name);

            if (current.name.equals(end)) {
                return new Pair<>(current.cost, current.path);
            }

            for (AbstractMap.SimpleEntry<String, Integer> neighbor : graph.getOrDefault(current.name, new ArrayList<>())) {
                String nextNode = neighbor.getKey();
                int weight = neighbor.getValue();
                int extraCost = tollPoints.contains(nextNode) ? 5 : 0;

                if (!visited.contains(nextNode)) {
                    pq.add(new Node(nextNode, current.cost + weight + extraCost, current.path));
                }
            }
        }
        return new Pair<>(Integer.MAX_VALUE, new ArrayList<>());
    }

    public static void main(String[] args) {
        addEdge("A", "B", 10);
        addEdge("A", "C", 20);
        addEdge("B", "C", 15);
        addEdge("B", "D", 25);
        addEdge("C", "D", 30);

        chargingStations.add("B");
        chargingStations.add("C");
        tollPoints.add("C");

        Pair<Integer, List<String>> result = dijkstra("A", "D");
        System.out.println("Optimal Route: " + String.join(" -> ", result.getValue()) + " with cost: " + result.getKey());
    }
}

class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}
