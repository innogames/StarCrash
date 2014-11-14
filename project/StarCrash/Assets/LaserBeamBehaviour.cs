using UnityEngine;
using System.Collections;

public class LaserBeamBehaviour : MonoBehaviour {

	private float aplha = 1.0f;
	Light light;
	Light lightImpact;

	// Use this for initialization
	void Start () {
		light = GameObject.Find ("MuzzleLight").GetComponent<Light> ();
		lightImpact = GameObject.Find ("ImpactLight").GetComponent<Light> ();
	}

	public void Fire(Vector3 start, Vector3 end) {
		light.transform.position = start;
		light.intensity = 1;

		lightImpact.transform.position = end;
		lightImpact.intensity = 1;

		LineRenderer line = GetComponent<LineRenderer> ();
		Color color = line.material.GetColor("_TintColor");
		color.a = 1.0f;
		line.material.SetColor("_TintColor", color);
	}

	
	// Update is called once per frame
	void Update () {
		LineRenderer line = GetComponent<LineRenderer> ();
		Color color = line.material.GetColor("_TintColor");
		color.a -= 0.3f;
		light.intensity -= 0.5f;
		lightImpact.intensity -= 0.5f;
		line.material.SetColor("_TintColor", color);
	}



}
