using UnityEngine;
using System.Collections;

public class LevelBehaviour : MonoBehaviour {

	// Use this for initialization
	void Start () {

		/*MeshCollider meshc = gameObject.AddComponent(typeof(MeshCollider)) as MeshCollider;

		foreach (Transform child in gameObject.GetComponentsInChildren<Transform>()) {

			MeshCollider mc = GetComponent<MeshCollider>();
			myMC.sharedMesh = child.GetComponent<MeshFilter> ().mesh;
		}*/

		Transform[] allChildren = GetComponentsInChildren<Transform>();
		foreach (Transform child in allChildren) {
			MeshCollider mc = GetComponent<MeshCollider>();
			mc.sharedMesh = child.GetComponent<MeshFilter> ().mesh;
		}
		

	}
	
	// Update is called once per frame
	void Update () {

	}
}
