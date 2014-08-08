using UnityEngine;
using System.Collections;

public class LevelBehaviour : MonoBehaviour {
	
	// Use this for initialization
	void Start () {
		Transform[] allChildren = GetComponentsInChildren<Transform>();
		foreach (Transform child in allChildren) {
			MeshCollider mc = child.gameObject.AddComponent(typeof(MeshCollider)) as MeshCollider;
			mc = new MeshCollider();
		}
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
