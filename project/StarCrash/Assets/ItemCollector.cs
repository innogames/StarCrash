using UnityEngine;
using System.Collections;

public class ItemCollector : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnTriggerEnter(Collider collider) {

		if (collider.gameObject.tag == "Item") {
			collider.gameObject.SetActive (false);
			Destroy (collider.gameObject);		
		}
	}
}
